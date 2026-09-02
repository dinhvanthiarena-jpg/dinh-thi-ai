const User = require('./User');
const Course = require('./Course');
const Lesson = require('./Lesson');
const Enrollment = require('./Enrollment');
const Order = require('./Order');
const BlogPost = require('./BlogPost');
const Review = require('./Review');
const ContactMessage = require('./ContactMessage');
const GalleryPhoto = require('./GalleryPhoto');
const ChatMessage = require('./ChatMessage');
const SocialPost = require('./SocialPost');
const RepliedComment = require('./RepliedComment');
const Tool = require('./Tool');
const GameInstall = require('./GameInstall');
const PushSubscription = require('./PushSubscription');
const ProOrder = require('./ProOrder');
const MonlTienDo = require('./MonlTienDo');
const PageView = require('./PageView');
const AffiliateClick = require('./AffiliateClick');
const BattlePlayer = require('./BattlePlayer');
const BattleMatch = require('./BattleMatch');
const Sawmill = require('./Sawmill');
const Vehicle = require('./Vehicle');
const Worker = require('./Worker');
const PurchaseTrip = require('./PurchaseTrip');
const LaborLog = require('./LaborLog');
const SawdustBatch = require('./SawdustBatch');
const SawdustSale = require('./SawdustSale');
const FirewoodPurchase = require('./FirewoodPurchase');
const FirewoodSale = require('./FirewoodSale');
const Expense = require('./Expense');

Course.hasMany(Lesson, { foreignKey: 'CourseId', onDelete: 'CASCADE' });
Lesson.belongsTo(Course, { foreignKey: 'CourseId', as: 'course' });

User.hasMany(Enrollment, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Enrollment.belongsTo(User, { foreignKey: 'UserId', as: 'user' });
Course.hasMany(Enrollment, { foreignKey: 'CourseId', onDelete: 'CASCADE' });
Enrollment.belongsTo(Course, { foreignKey: 'CourseId', as: 'course' });
Order.hasOne(Enrollment, { foreignKey: 'OrderId' });
Enrollment.belongsTo(Order, { foreignKey: 'OrderId', as: 'order' });

User.hasMany(ProOrder, { foreignKey: 'UserId', onDelete: 'CASCADE' });
ProOrder.belongsTo(User, { foreignKey: 'UserId', as: 'user' });

User.hasOne(MonlTienDo, { foreignKey: 'UserId', onDelete: 'CASCADE' });
MonlTienDo.belongsTo(User, { foreignKey: 'UserId', as: 'user' });

User.hasMany(Order, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'UserId', as: 'user' });
Course.hasMany(Order, { foreignKey: 'CourseId' });
Order.belongsTo(Course, { foreignKey: 'CourseId', as: 'course' });

User.hasMany(Review, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'UserId', as: 'user' });
Course.hasMany(Review, { foreignKey: 'CourseId', onDelete: 'CASCADE' });
Review.belongsTo(Course, { foreignKey: 'CourseId', as: 'course' });

User.hasMany(BlogPost, { foreignKey: 'AuthorId', as: 'posts' });
BlogPost.belongsTo(User, { foreignKey: 'AuthorId', as: 'author' });

// --- Mùn cưa & Củi ---
Sawmill.hasMany(PurchaseTrip, { foreignKey: 'SawmillId', onDelete: 'RESTRICT' });
PurchaseTrip.belongsTo(Sawmill, { foreignKey: 'SawmillId', as: 'sawmill' });

Vehicle.hasMany(PurchaseTrip, { foreignKey: 'VehicleId', onDelete: 'SET NULL' });
PurchaseTrip.belongsTo(Vehicle, { foreignKey: 'VehicleId', as: 'vehicle' });

Worker.hasMany(PurchaseTrip, { foreignKey: 'DriverId', onDelete: 'SET NULL' });
PurchaseTrip.belongsTo(Worker, { foreignKey: 'DriverId', as: 'driver' });

User.hasMany(PurchaseTrip, { foreignKey: 'CreatedById', onDelete: 'SET NULL' });
PurchaseTrip.belongsTo(User, { foreignKey: 'CreatedById', as: 'createdBy' });

PurchaseTrip.hasOne(SawdustBatch, { foreignKey: 'PurchaseTripId', onDelete: 'SET NULL' });
SawdustBatch.belongsTo(PurchaseTrip, { foreignKey: 'PurchaseTripId', as: 'trip' });

Worker.hasMany(LaborLog, { foreignKey: 'WorkerId', onDelete: 'CASCADE' });
LaborLog.belongsTo(Worker, { foreignKey: 'WorkerId', as: 'worker' });

PurchaseTrip.hasMany(LaborLog, { foreignKey: 'PurchaseTripId', onDelete: 'SET NULL' });
LaborLog.belongsTo(PurchaseTrip, { foreignKey: 'PurchaseTripId', as: 'trip' });

User.hasMany(LaborLog, { foreignKey: 'CreatedById', onDelete: 'SET NULL' });
LaborLog.belongsTo(User, { foreignKey: 'CreatedById', as: 'createdBy' });

User.hasMany(SawdustBatch, { foreignKey: 'CreatedById', onDelete: 'SET NULL' });
SawdustBatch.belongsTo(User, { foreignKey: 'CreatedById', as: 'createdBy' });

User.hasMany(SawdustSale, { foreignKey: 'CreatedById', onDelete: 'SET NULL' });
SawdustSale.belongsTo(User, { foreignKey: 'CreatedById', as: 'createdBy' });

Vehicle.hasMany(FirewoodPurchase, { foreignKey: 'VehicleId', onDelete: 'SET NULL' });
FirewoodPurchase.belongsTo(Vehicle, { foreignKey: 'VehicleId', as: 'vehicle' });

User.hasMany(FirewoodPurchase, { foreignKey: 'CreatedById', onDelete: 'SET NULL' });
FirewoodPurchase.belongsTo(User, { foreignKey: 'CreatedById', as: 'createdBy' });

User.hasMany(FirewoodSale, { foreignKey: 'CreatedById', onDelete: 'SET NULL' });
FirewoodSale.belongsTo(User, { foreignKey: 'CreatedById', as: 'createdBy' });

User.hasMany(Expense, { foreignKey: 'CreatedById', onDelete: 'SET NULL' });
Expense.belongsTo(User, { foreignKey: 'CreatedById', as: 'createdBy' });

module.exports = {
  User,
  Course,
  Lesson,
  Enrollment,
  Order,
  BlogPost,
  Review,
  ContactMessage,
  GalleryPhoto,
  ChatMessage,
  SocialPost,
  RepliedComment,
  Tool,
  GameInstall,
  PushSubscription,
  ProOrder,
  MonlTienDo,
  PageView,
  AffiliateClick,
  BattlePlayer,
  BattleMatch,
  Sawmill,
  Vehicle,
  Worker,
  PurchaseTrip,
  LaborLog,
  SawdustBatch,
  SawdustSale,
  FirewoodPurchase,
  FirewoodSale,
  Expense,
};
