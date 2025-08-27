import 'dotenv/config';
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as GitHubStrategy } from 'passport-github2'
import jwt from 'jsonwebtoken'
import Account from './models/userModel.js'


function makeToken(user) {
return jwt.sign(
{ uid: user._id, email: user.email, name: user.displayName },
process.env.JWT_KEY,
{ expiresIn: '7d' }
)
}


async function findOrCreate({ provider, profile, email, name, providerId }) {
let user = await Account.findOne({ provider, providerId })
if (!user) {
user = await Account.create({ provider, providerId, email, displayName: name })
console.log('Created new account:', user.email)
} else {
console.log('Found existing account:', user.email)
}
return user
}


passport.use(new GoogleStrategy({
clientID: process.env.GOOGLE_ID,
clientSecret: process.env.GOOGLE_SECRET,
callbackURL: '/api/auth/google/callback'
}, async (_, __, profile, done) => {
const email = profile.emails?.[0]?.value
const user = await findOrCreate({ provider: 'google', profile, email, name: profile.displayName, providerId: profile.id })
done(null, user)
}))


passport.use(new GitHubStrategy({
clientID: process.env.GITHUB_ID,
clientSecret: process.env.GITHUB_SECRET,
callbackURL: '/api/auth/github/callback'
}, async (_, __, profile, done) => {
const email = profile.emails?.[0]?.value
const user = await findOrCreate({ provider: 'github', profile, email, name: profile.displayName || profile.username, providerId: profile.id })
done(null, user)
}))


export function redirectOAuth(res, user) {
const token = makeToken(user)
const url = new URL(process.env.CLIENT_URL + '/oauth-callback')
url.searchParams.set('token', token)
res.redirect(url.toString())
}