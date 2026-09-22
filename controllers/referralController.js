const { Op } = require('sequelize');
const { User, WalletTransaction, WithdrawRequest } = require('../models');
const wallet = require('../services/walletService');

exports.index = async (req, res) => {
  const user = req.user;

  const f1 = await User.findAll({
    where: { parentId: user.id },
    attributes: ['id', 'name', 'email', 'createdAt'],
    order: [['createdAt', 'DESC']],
  });
  const f1Ids = f1.map((u) => u.id);
  const f2 = f1Ids.length
    ? await User.findAll({
        where: { parentId: { [Op.in]: f1Ids } },
        attributes: ['id', 'name', 'email', 'parentId', 'createdAt'],
        order: [['createdAt', 'DESC']],
      })
    : [];

  const commissionHistory = await WalletTransaction.findAll({
    where: { UserId: user.id, type: { [Op.in]: ['commission_l1', 'commission_l2'] } },
    order: [['createdAt', 'DESC']],
    limit: 50,
  });
  const totalCommission = commissionHistory.reduce((sum, tx) => sum + tx.amount, 0);

  const withdrawRequests = await WithdrawRequest.findAll({
    where: { UserId: user.id },
    order: [['createdAt', 'DESC']],
    limit: 10,
  });

  res.render('referral/index', {
    title: 'Giới thiệu bạn bè',
    refCode: user.refCode,
    soDu: wallet.soDu(user),
    f1,
    f2,
    commissionHistory,
    totalCommission,
    withdrawRequests,
  });
};

exports.requestWithdraw = async (req, res) => {
  const user = req.user;
  const amount = Number(req.body.amount);
  const { bankName, bankAccount, bankAccountName } = req.body;

  try {
    if (!Number.isInteger(amount) || amount < 50000) throw new Error('Số tiền rút tối thiểu 50.000đ.');
    if (amount > wallet.soDu(user)) throw new Error('Số dư ví không đủ.');
    if (!bankName || !bankAccount || !bankAccountName) throw new Error('Vui lòng nhập đầy đủ thông tin ngân hàng.');

    await WithdrawRequest.create({
      UserId: user.id,
      amount,
      bankName,
      bankAccount,
      bankAccountName,
      status: 'pending',
    });
    req.flash('success', 'Đã gửi yêu cầu rút tiền, admin sẽ duyệt và chuyển khoản sớm.');
  } catch (err) {
    req.flash('error', err.message);
  }
  res.redirect('/gioi-thieu-ban-be');
};
