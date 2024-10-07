export default function Instruct() {
    return (
        <div>
            <div className="mb-5">
                <h5 className="font-bold text-2xl text-center">Cờ Ca-rô</h5>
            </div>
            <ol className="text-justify *:mb-2 last:*:mb-0">
                <li>
                    <strong>Người chơi: </strong>Có hai người chơi, mỗi người chọn một ký hiệu riêng. Một người sẽ là
                    &quot;X&quot; và người còn lại sẽ là &quot;O&quot;.
                </li>
                <li>
                    <strong>Mục tiêu: </strong>Người chơi nào có được <strong>5</strong> ký hiệu của mình liên tiếp theo
                    hàng ngang, hàng dọc hoặc chéo thì thắng. Kể cả khi bị người chơi còn lại chặn 2 đầu.
                </li>
                <li>
                    <strong>Lượt chơi: </strong>Hai người chơi sẽ lần lượt đánh dấu một ô trên bàn cờ. Người đầu tiên
                    đặt ký hiệu &quot;X&quot;, sau đó là &quot;O&quot;, và cứ tiếp tục luân phiên.
                </li>
                <li>
                    <strong>Kết thúc trò chơi: </strong>Trò chơi kết thúc khi có một người chơi thắng.
                </li>
                <li>
                    <strong>Cách chiến thắng: </strong>Để thắng, một người chơi phải tạo ra một hàng gồm ba ký hiệu
                    giống nhau (theo hàng ngang, dọc hoặc chéo).
                </li>
            </ol>
        </div>
    );
}
