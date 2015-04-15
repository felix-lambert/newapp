exports = module.exports = function(mongoose) {
  console.log('**********************models******************');
  require('./schemas/announceSchemas/AnnounceCommentModel')(mongoose);
  require('./schemas/userSchemas/NotificationModel')(mongoose);
  require('./schemas/userSchemas/TokenModel')(mongoose);
  require('./schemas/userSchemas/StatusModel')(mongoose);
  require('./schemas/userSchemas/UserModel')(mongoose);
  require('./schemas/userSchemas/FriendModel')(mongoose);
  require('./schemas/chatSchemas/MessageModel')(mongoose);
  require('./schemas/chatSchemas/RoomModel')(mongoose);
  require('./schemas/userSchemas/ImageModel')(mongoose);
  require('./schemas/announceSchemas/AnnounceModel')(mongoose);
  require('./schemas/announceSchemas/CategoryModel')(mongoose);
  require('./schemas/transactionSchemas/TransactionModel')(mongoose);
};
