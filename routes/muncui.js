const express = require('express');
const router = express.Router();

const { requireAuth, requireSawdustAccess, requireSawdustManager, requireSawdustOwner } = require('../middleware/auth');

const dashboardController = require('../controllers/muncui/dashboardController');
const sawmillController = require('../controllers/muncui/sawmillController');
const vehicleController = require('../controllers/muncui/vehicleController');
const workerController = require('../controllers/muncui/workerController');
const tripController = require('../controllers/muncui/tripController');
const laborController = require('../controllers/muncui/laborController');
const sawdustController = require('../controllers/muncui/sawdustController');
const firewoodController = require('../controllers/muncui/firewoodController');
const expenseController = require('../controllers/muncui/expenseController');
const memberController = require('../controllers/muncui/memberController');
const reportController = require('../controllers/muncui/reportController');

// Toàn bộ module yêu cầu đăng nhập + có quyền trong module Mùn cưa & Củi
// (site admin hoặc thành viên được cấp sawdustRole).
router.use(requireAuth, requireSawdustAccess);
router.use((req, res, next) => {
  res.locals.layout = 'layouts/muncui';
  next();
});

router.get('/', dashboardController.dashboard);
router.get('/bao-cao', requireSawdustManager, reportController.report);

// Danh mục (xưởng xẻ, xe, nhân công) — quản lý trở lên mới được sửa/xóa,
// nhân viên chỉ xem để chọn khi nhập liệu.
router.get('/xuong-xe', sawmillController.list);
router.post('/xuong-xe', requireSawdustManager, sawmillController.create);
router.post('/xuong-xe/:id', requireSawdustManager, sawmillController.update);
router.post('/xuong-xe/:id/delete', requireSawdustManager, sawmillController.remove);

router.get('/xe', vehicleController.list);
router.post('/xe', requireSawdustManager, vehicleController.create);
router.post('/xe/:id', requireSawdustManager, vehicleController.update);
router.post('/xe/:id/delete', requireSawdustManager, vehicleController.remove);

router.get('/nhan-cong', workerController.list);
router.post('/nhan-cong', requireSawdustManager, workerController.create);
router.post('/nhan-cong/:id', requireSawdustManager, workerController.update);
router.post('/nhan-cong/:id/delete', requireSawdustManager, workerController.remove);

// Chuyến mua mùn — ai cũng ghi nhận được (nhân viên đi mua mùn về nhập
// liệu), chỉ quản lý trở lên mới xóa được để tránh mất dữ liệu.
router.get('/chuyen-mua-mun', tripController.list);
router.post('/chuyen-mua-mun', tripController.create);
router.post('/chuyen-mua-mun/:id', tripController.update);
router.post('/chuyen-mua-mun/:id/delete', requireSawdustManager, tripController.remove);

router.get('/cong-nhat', laborController.list);
router.post('/cong-nhat', laborController.create);
router.post('/cong-nhat/:id', laborController.update);
router.post('/cong-nhat/:id/delete', requireSawdustManager, laborController.remove);

router.get('/kho-mun', sawdustController.batchList);
router.post('/kho-mun', sawdustController.batchCreate);
router.post('/kho-mun/:id', sawdustController.batchUpdate);
router.post('/kho-mun/:id/delete', requireSawdustManager, sawdustController.batchRemove);

router.get('/ban-mun', sawdustController.saleList);
router.post('/ban-mun', sawdustController.saleCreate);
router.post('/ban-mun/:id', sawdustController.saleUpdate);
router.post('/ban-mun/:id/delete', requireSawdustManager, sawdustController.saleRemove);

router.get('/mua-cui', firewoodController.purchaseList);
router.post('/mua-cui', firewoodController.purchaseCreate);
router.post('/mua-cui/:id', firewoodController.purchaseUpdate);
router.post('/mua-cui/:id/delete', requireSawdustManager, firewoodController.purchaseRemove);

router.get('/ban-cui', firewoodController.saleList);
router.post('/ban-cui', firewoodController.saleCreate);
router.post('/ban-cui/:id', firewoodController.saleUpdate);
router.post('/ban-cui/:id/delete', requireSawdustManager, firewoodController.saleRemove);

router.get('/chi-phi', expenseController.list);
router.post('/chi-phi', expenseController.create);
router.post('/chi-phi/:id', expenseController.update);
router.post('/chi-phi/:id/delete', requireSawdustManager, expenseController.remove);

// Thành viên Ban quản trị — chỉ chủ xưởng (owner) mới được cấp/gỡ quyền.
router.get('/thanh-vien', requireSawdustOwner, memberController.list);
router.post('/thanh-vien', requireSawdustOwner, memberController.add);
router.post('/thanh-vien/:id', requireSawdustOwner, memberController.updateRole);
router.post('/thanh-vien/:id/delete', requireSawdustOwner, memberController.remove);

module.exports = router;
