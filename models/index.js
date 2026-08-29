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
};
