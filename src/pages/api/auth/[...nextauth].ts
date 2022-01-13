import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { signIn } from "next-auth/react"
import { fauna } from '../../../services/fauna';
import { query as q } from "faunadb";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'
    }),
  ],
  callbacks: {
    async signIn(user, account, profile) {
      const githubUser = user

      const email = githubUser.user.email;

      try{
        await fauna.query(
          q.Create(
            q.Collection('users'),
            { data: { email }}
          )
        )

        return true;
      } catch(error){
        console.log(error);
        
        return false;
      }
    },
  },
})