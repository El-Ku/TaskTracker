import ChangePassword from "../components/profile/ChangePassword";
import ChangeUserInfo from "../components/profile/ChangeUserInfo";
import DeleteAccount from "../components/profile/DeleteAccount";

function Profile() {
  return (
    <div className="flex flex-col ml-6 min-w-xl">
      <h1 className="text-4xl m-4">
        Welcome,{" "}
        <span className="font-bold">
          {localStorage.getItem("userName") || user.fullName}!
        </span>
      </h1>
      <hr />

      <ChangeUserInfo />
      <h2 className="text-2xl underline font-bold my-4">Account Settings</h2>
      <ChangePassword />
      <hr />
      <DeleteAccount />
    </div>
  );
}

export default Profile;
