import {Button, Card} from "@/components/UI";
import Link from "next/link";
import {memo} from "react";
import {GoHomeFill} from "react-icons/go";

export default memo(function MatchNotExists() {
    return (
        <Card className="h-max p-5 sm:p-10">
            <div className="font-semibold text-lg">Phòng không tồn tại hoặc đã kết thúc.</div>
            <div className="mt-10 flex justify-center">
                <Link href="/">
                    <Button type="button" className="bg-primary-5">
                        <GoHomeFill />
                        Trang chủ
                    </Button>
                </Link>
            </div>
        </Card>
    );
});
