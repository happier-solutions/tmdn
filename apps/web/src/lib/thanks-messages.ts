// What the reader sees after hearting a post.
const THANKS_MESSAGES = [
	'Bài viết chỉ là trái nhỏ mà bạn vẫn nhớ đến người trồng. Chúc khu vườn của bạn năm nào cũng trĩu quả.',
	'Có bạn đọc cùng, đường học của tôi bớt đơn độc hẳn. Chúc bạn cũng luôn có người đi cùng trên đường của mình.',
	'Trái tim của bạn cho tôi thêm sức để viết tiếp. Chúc những việc bạn đang dồn sức làm sớm có ngày thành công.',
	'Bạn chưa nói lời nào mà tôi đã thấy vui trong lòng. Chúc bạn luôn được nghe những lời dịu dàng.',
	'Cảm ơn bạn đã đi cùng tôi một đoạn. Chúc chặng đường nào của bạn cũng có thêm điều hay để học.',
	'Tôi viết để học, và hôm nay tôi có thêm một người bạn học. Chúc bạn gặp thật nhiều người bạn đáng quý.',
	'Có hôm viết xong tôi chẳng biết có ai đọc không, nên trái tim này quý lắm. Chúc bạn luôn gặp người giúp đúng lúc cần.',
	'Bạn vừa dành chút thương cho một người viết chưa quen. Mong bạn cũng thương mình như thế, nhất là những ngày mệt.',
	'Được gần những người đọc như bạn, chữ của tôi cũng sáng lên đôi chút. Chúc quanh bạn luôn có nhiều ngọn đèn.',
	'Trái tim của bạn là thêm một mái chèo cho tôi. Chúc bạn vững tay qua mọi con sóng phía trước.',
	'Nếu đây là lúc khó của bạn, mong bài viết đỡ được đôi phần. Còn nếu mọi sự đang thuận, chúc bạn thuận thật dài.',
	'Tôi cứ viết đều từng bài, và có bạn ở đây thì càng muốn viết tiếp. Chúc sự kiên trì của bạn sớm được đền đáp.',
	'Mỗi trái tim là một hạt nhỏ tôi gom về để viết tiếp. Chúc những điều nhỏ bạn góp nhặt mỗi ngày sớm đầy lên.',
	'Mong vài dòng hôm nay thấm dần và có ích với bạn vào một ngày nào đó. Chúc bạn luôn có thời gian chậm lại với điều mình thích.',
	'Hôm nay có một người lạ thả tim cho tôi, là bạn đấy. Chúc bạn luôn tươi tắn, đi đâu cũng được quý mến.',
	'Người dành lời khen cho một kẻ lạ hẳn là người hiền. Chúc điều lành tìm đến bạn sớm hơn bạn nghĩ.',
	'Cảm ơn bạn đã ghé góc nhỏ này trên đường đi của mình. Chúc bạn còn đi thật xa và về nhà thật vui.',
	'Một lời khen nhỏ cũng như một cái cây bạn vừa trồng. Chúc bóng mát của nó về lại với bạn và những người bạn thương.',
	'Chữ của tôi còn nhiều chỗ vụng, vậy mà bạn vẫn gửi cho một trái tim. Chúc bạn được yêu thương như cách bạn đã cho đi.',
	'Từ nay mình xem nhau như láng giềng trên mạng nhé. Chúc nhà bạn luôn ấm và xóm giềng luôn hiền.',
	'Đọc xong rồi bạn còn quay lại cảm ơn người viết, điều đó không nhiều người làm. Mong bạn luôn tìm được những điều đáng đọc.',
	'Mình chưa từng gặp mà đã cùng đọc chung mấy dòng chữ. Mong ở đâu bạn cũng có vài người để nương vào nhau.',
	'Một trái tim gửi cho người lạ cũng đủ ấm cả ngày. Mong những ngày trở lạnh luôn có ai đó ở cạnh bạn.',
	'Viết nhiều mà giữ lại chẳng bao nhiêu, nên cảm ơn bạn đã đọc những dòng còn lại này. Mong bữa cơm tối nay của bạn thật ngon.',
	'Đọc hết một bài giữa một ngày bận rộn đâu phải chuyện dễ, nên tôi cảm ơn bạn. Mong nhiều điều lành đang trên đường đến với bạn.',
	'Bài của tôi nước sơn chưa bóng, nên cảm ơn bạn đã nhìn vào phần gỗ. Mong những người quanh bạn cũng nhìn bạn như thế.',
	'Tôi chưa viết hay, chỉ cố nói thật điều mình biết. Cảm ơn bạn đã tin. Mong bạn cũng luôn giữ được điều mình coi trọng.',
	'Những dòng này chưa hay, chỉ là tay đang quen dần. Cảm ơn bạn đã ngồi xem tôi tập. Mong việc bạn đang tập cũng sớm thành quen.',
	'Viết phải học từng chút, nhất là học gói lại cho gọn. Cảm ơn bạn đã kiên nhẫn mở ra đọc. Mong thư nào đến tay bạn cũng là tin vui.',
	'Cảm ơn bạn đã ghé. Nếu bạn đang ở đoạn gian nan, mong mấy dòng này là một chỗ nghỉ chân. Rồi chặng này sẽ qua.',
	'Những bài viết này còn non lắm, vậy mà bạn vẫn ghé. Mong ở tuổi nào bạn cũng còn thấy trăng đẹp.',
	'Góc nhỏ này còn vắng, nên mỗi lần bạn ghé đều quý như vàng. Mong những gì bạn đang vun đắp luôn có người cùng chăm.',
	'Tôi còn khó nhọc với từng câu chữ, nhưng có bạn ghé đọc thì nhẹ hơn nhiều. Mong những ngày thảnh thơi của bạn đến sớm.',
	'Trái tim này như một bàn tay đỡ tôi những hôm viết mệt. Mong lúc cần, bạn cũng có người đỡ ngay bên cạnh.',
	'Giữa bao nhiêu thứ để đọc, bạn đã đi tới tận cuối bài này. Mong đường đến những người bạn thương luôn thật gần.',
	'Góc nhỏ này vẫn ở đây, bạn ghé lúc nào cũng được. Mong chuyến đi nào của bạn cũng có một bến để về.',
	'Bạn chỉ đi ngang mà còn dừng lại chào một cái. Tôi chẳng có gì hơn, chỉ xin gửi lời cảm ơn và mong đường bạn đi thật thuận.',
	'Chẳng liên quan gì đến bài viết, tôi chỉ muốn gửi bạn chút gió mát. Mong hôm nay của bạn có một phút thong thả.',
	'Đường đến góc nhỏ này hẳn quanh co, vậy mà bạn đã tới. Mong phía trước của bạn còn nhiều cảnh đẹp.',
	'Giữa mạng ồn ào, một trái tim lặng lẽ thế này làm tôi thấy dịu lòng. Mong quanh bạn lúc nào cũng có một chỗ yên.',
];

/** Never repeats the message just shown, so hearting twice always reads as something new. */
export const pickThanksMessage = (previous?: string) => {
	const pool = THANKS_MESSAGES.filter((message) => message !== previous);
	return pool[Math.floor(Math.random() * pool.length)];
};
