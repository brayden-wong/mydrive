export type UserProfile = {
  id: string;
  username: string;
  profile: {
    name: string;
    id: string;
    avatar: string | null;
  };
};
