"use client"
import { BaseContainer } from "@/app/components/Container";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { BaseCard } from "@/app/components/BaseCard";
import { Empty } from "@/app/components/Empty";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";


export default function DetailInvoice() {
  const router = useRouter();
  const queryParams: any = useSearchParams();
  const back = () => {
    router.back();
  }

  return(
    <BaseContainer>
        <CustomBreadcumb onBack={back} title="Detail Invoice"/>
        <BaseCard>
          <Empty
            title={"Invoice " + queryParams.id}
            subtitle="Periksa dan Pastikan Nomor Invoice sudah benar!"
          />
        </BaseCard>
    </BaseContainer>
  );
}
