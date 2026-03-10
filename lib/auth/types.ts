import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      userType: string;
      status: string;
      provider: string;
    };
  }

  interface User {
    userType?: string;
    status?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userType?: string;
    status?: string;
    provider?: string;
  }
}
