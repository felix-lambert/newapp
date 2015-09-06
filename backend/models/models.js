var chalk     = require('chalk');

exports = module.exports = function(mongoose) {
  console.log(chalk.blue('**********************models******************************'));
  require('./schemas/notificationSchemas/NotificationModel')(mongoose);
  require('./schemas/notificationSchemas/LikeModel')(mongoose);
  require('./schemas/userSchemas/TokenModel')(mongoose);
  require('./schemas/actualitySchemas/StatusModel')(mongoose);
  require('./schemas/userSchemas/ImageModel')(mongoose);
  require('./schemas/userSchemas/UserModel')(mongoose);
  require('./schemas/notificationSchemas/FriendModel')(mongoose);
  require('./schemas/chatSchemas/MessageModel')(mongoose);
  require('./schemas/chatSchemas/RoomModel')(mongoose);
  require('./schemas/announceSchemas/AnnounceModel')(mongoose);
  require('./schemas/announceSchemas/AnnounceCommentModel')(mongoose);
  require('./schemas/announceSchemas/CategoryModel')(mongoose);
  require('./schemas/transactionSchemas/TransactionModel')(mongoose);
  require('./schemas/actualitySchemas/ActualityModel')(mongoose);
};
