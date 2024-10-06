export default function LoadingScreen() {
    return (
        <div className="fixed z-50 left-0 top-0 w-full h-full overflow-hidden bg-white flex items-center justify-center">
            {/* <div className="flex flex-col items-center">
                <div className="flex gap-4">
                    <span className="loading loading-ring loading-lg text-blue-500"></span>
                    <span className="loading loading-ring loading-lg text-yellow-500"></span>
                    <span className="loading loading-ring loading-lg text-rose-500"></span>
                </div>
            </div> */}
            {/* <h1>Loading...</h1> */}
            <div className="loading loading-spinner loading-lg"></div>
        </div>
    );
}
