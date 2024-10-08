import Image from "next/image";
import Logo from "../../../images/tic-tac-toe-logo.png";
import {LuLogIn} from "react-icons/lu";
import {FaUserFriends} from "react-icons/fa";
import {useRecoilValue} from "recoil";
import {playerInfoState} from "@/libs/recoil/atoms/playerInfoAtom";
import {AvailableCrumbs} from "@/app/page";
import {IoBookSharp} from "react-icons/io5";

interface Props {
    onAddCrumb: (crumb: AvailableCrumbs) => void;
}

interface ItemProps {
    children: React.ReactNode;
    onClick: () => void;
}

function Item(props: ItemProps) {
    return (
        <div
            className="cursor-pointer w-full px-4 py-3 rounded-2xl hover:bg-primary-5 flex items-center justify-center"
            onClick={props.onClick}
        >
            {props.children}
        </div>
    );
}

export default function Home(props: Props) {
    const playerInfo = useRecoilValue(playerInfoState)!;

    return (
        <div className="w-full">
            <div className="w-full flex justify-center mb-7">
                <Image
                    src={Logo}
                    alt="logo"
                    width={92}
                    height={92}
                    className="block animate-zoom-in-out sm:w-28 sm:h-2w-28"
                    priority={true}
                />
            </div>
            <div className="w-full mb-5">
                <div className="px-4 bg-gradient-to-r from-x-player via-purple-500 to-o-player bg-[length:150%_150%] animate-gradient-move h-12 sm:h-14 w-full rounded-2xl flex items-center justify-center">
                    <div className="flex items-center overflow-hidden gap-2 text-lg sm:text-xl font-semibold text-primary-1">
                        <span className="flex-shrink-0">Xin chào!</span>
                        <span className="w-full truncate">{playerInfo.name || ""}</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-stretch gap-2 overflow-y-auto">
                <Item onClick={() => props.onAddCrumb("new game")}>
                    <LuLogIn className="w-5 h-5 mr-2" />
                    <span className="font-semibold text-base">Chơi mới</span>
                </Item>
                <Item onClick={() => props.onAddCrumb("play with friend")}>
                    <FaUserFriends className="w-5 h-5 mr-2" />
                    <span className="font-semibold text-base">Chơi cùng bạn</span>
                </Item>
                <Item onClick={() => props.onAddCrumb("instruct")}>
                    <IoBookSharp className="w-5 h-5 mr-2" />
                    <span className="font-semibold text-base">Hướng dẫn</span>
                </Item>
            </div>
        </div>
    );
}
