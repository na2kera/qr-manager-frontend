import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const provider = account?.provider;
      const uid = user?.id;
      const name = user?.name;
      const email = user?.email;

      console.log("Sending user data to backend:", {
        provider,
        uid,
        name,
        email,
      });

      try {
        const response = await fetch(`${apiUrl}/auth/${provider}/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ provider, uid, name, email }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Backend error:", response.status, errorData);
          return false;
        }

        return true;
      } catch (error) {
        console.error("Network error:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // ユーザーIDを設定
        session.user.id = token.sub;
        // アクセストークンには文字列値を設定（例：jtiまたはsub）
        session.accessToken = token.jti || token.sub;
      }
      return session;
    },
  },
});
export { handler as GET, handler as POST };
