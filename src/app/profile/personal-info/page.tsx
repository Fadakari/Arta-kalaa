export const dynamic = 'force-dynamic';

import PersonalInfoForm from "@/components/Profile/PersonalInfoForm";
import { Suspense } from "react";
import { CiUser } from "react-icons/ci";
import Loading from "./loading";

function page() {
  return (
    <div className="relative flex flex-col">
      <h1 className="flex items-center gap-1 font-semibold text-xl">
        <CiUser className="size-8 stroke-1 text-primary" />
        <span className="pt-1">اطلاعات شخصی</span>
      </h1>
      <Suspense fallback={<Loading />}>
        <PersonalInfoForm />
      </Suspense>
    </div>
  );
}

export default page;

