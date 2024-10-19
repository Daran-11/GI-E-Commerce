'use client'
import dynamic from "next/dynamic";
import styles from "../ui/dashboard/dashboard.module.css";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Card = dynamic(() => import("../ui/dashboard/card/card"), {
  loading: () => <p>Loading...</p>,
});
const Notification = dynamic(() => import("../ui/dashboard/notification/notification"), {
  loading: () => <p>Loading...</p>,
});
const Chart = dynamic(() => import("../ui/dashboard/chart/chart"), {
  loading: () => <p>Loading Chart...</p>,
});
const Transactions = dynamic(() => import("../ui/dashboard/transactions/transactions"), {
  loading: () => <p>Loading Transactions...</p>,
});

const DashboardAdmin = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Run this logic only if the component is mounted and the router is ready
    if (router.isReady) {
      if (status === "unauthenticated") {
        router.push("/login");
      }

      if (status === "authenticated" && session?.user?.id) {
        fetchTotalCount(); // First fetch total count
        fetchProducts(page); // Then fetch products
      }
    }
  }, [status, session, router.isReady]);

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  if (status === "unauthenticated") {
    return null; // Or a loading indicator while redirecting
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.cards}>
          <Card />
          <Card />
          <Card />
          <Notification />
        </div>
        <div>
          <Transactions />
        </div>
        <Chart />
      </div>
    </div>
  );
};

export default DashboardAdmin;
