import mongoose from 'mongoose'


const schema = new mongoose.Schema(
{
email: { type: String, unique: true, sparse: true },
displayName: String,
passwordHash: String,
provider: { type: String, default: 'local' },
providerId: String
},
{ timestamps: true }
)


export default mongoose.models.Account || mongoose.model('Account', schema);