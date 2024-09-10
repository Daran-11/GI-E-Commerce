// app/account/layout.js
import AccountLayout from "@/components/account/accountLayout";
export default function AccountLayoutWrapper({ children }) {
  return (
    <AccountLayout>
      <div className="lg:pl-[200px] mt-[130px]  ">
        {" "}
        {/* Add padding here */}
        {children}
      </div>
    </AccountLayout>
  );
}
