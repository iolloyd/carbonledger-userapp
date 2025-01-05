import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  // Make sure these URLs match your development environment
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}) 
