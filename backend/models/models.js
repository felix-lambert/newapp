exports = module.exports = function(mongoose) {
  console.log('**********************models******************');
  require('./schemas/notificationSchemas/NotificationModel')(mongoose);
  require('./schemas/userSchemas/TokenModel')(mongoose);
  require('./schemas/StatusModel')(mongoose);
  require('./schemas/userSchemas/UsernameModel')(mongoose);
  require('./schemas/userSchemas/UserModel')(mongoose);
  require('./schemas/notificationSchemas/FriendModel')(mongoose);
  require('./schemas/chatSchemas/MessageModel')(mongoose);
  require('./schemas/chatSchemas/RoomModel')(mongoose);
  require('./schemas/announceSchemas/AnnounceModel')(mongoose);
  require('./schemas/announceSchemas/AnnounceCommentModel')(mongoose);
  require('./schemas/announceSchemas/CategoryModel')(mongoose);
  require('./schemas/transactionSchemas/TransactionModel')(mongoose);
};
