exports = module.exports = function(mongoose) {

  var Schema = mongoose.Schema;

  var transactionSchema = new Schema({
    announce: {
      type: Schema.ObjectId,
      ref: 'Announce'
    },
    status: {
      type: Number,
      default : 0,
      min: -1,
      max : 5
    },
    /*
    status : -1 > transaction canceled
    0 > noone accepted yet
    1 > only 1 user accepted
    2 > both accepted
    3 > received
    4 > not received
    */
    statusInformation : {
      type:String,
      default: 'En attente'
    },
    owner : // owner of the announce
    {
      uId: {
        type: Schema.ObjectId,
        ref: 'User'
      },
      username : String,
      status: {
        type: Number,
        default : 0,
        min: -1,
        max : 5
      },
    },
    client : // client interested by the announce
    {
      uId: {
        type: Schema.ObjectId,
        ref: 'User'
      },
      username : String,
      status: {
        type: Number,
        default : 0,
        min: -1,
        max : 5
      },
    },
    /*
      -1 : transaction canceled
      0 : no acton yet
      1 : transaction accepted
      3 : not received
    */
    clientprice: {
      type: Number,
      min : 1,
    },
    date: {
      type: Date,
      default: Date.now
    },
    updated: [Date]
  });

  /////////////////////////////////////////////////////////////////
  // PRE SAVE /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  transactionSchema.pre('save', function(next, req, callback) {
    console.log('***************presave announce*****************');
    if (this.isNew) {
      this.date = Date.now();
    }
    this.updated.push(Date.now());
    next();
  });

  transactionSchema.methods = {

    getPublicTransactionInformation: function(req, callback) {

      if (this.status == 1 && this.client.status == 1 ||
        this.owner.status == 1) {
        var usernameAccepted = this.client.status == 1 ?
        this.client.username : this.owner.username;
        if (req.user.username == usernameAccepted) {
          this.statusInformation = 'Vous avez accepté la transaction';
        } else {
          this.status = 0;
          this.statusInformation = usernameAccepted +
          ' a accepté la transaction';
        }
      }

      return callback({
          status:this.status,
          statusInformation: this.statusInformation,
        });
    },
  };

  var Transaction = mongoose.model('Transaction', transactionSchema);
};
