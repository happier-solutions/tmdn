// What the reader sees after hearting a post: a folk saying, then a wish that picks up on it.
const THANKS_MESSAGES = [
	{
		proverb: 'Ăn quả nhớ kẻ trồng cây.',
		wish: 'Bài viết chỉ là trái nhỏ mà bạn vẫn nhớ đến người trồng. Chúc khu vườn của bạn năm nào cũng trĩu quả.',
	},
	{
		proverb: 'Một cây làm chẳng nên non,\nBa cây chụm lại nên hòn núi cao.',
		wish: 'Có bạn đọc cùng, đường học của tôi bớt đơn độc hẳn. Chúc bạn luôn có những người chụm lại bên mình.',
	},
	{
		proverb: 'Có công mài sắt, có ngày nên kim.',
		wish: 'Trái tim của bạn cho tôi thêm sức để mài tiếp. Chúc những việc bạn đang bền bỉ làm sớm đến ngày nên kim.',
	},
	{
		proverb: 'Lời nói chẳng mất tiền mua,\nLựa lời mà nói cho vừa lòng nhau.',
		wish: 'Bạn chưa nói lời nào mà tôi đã thấy vừa lòng. Chúc bạn luôn được nghe những lời dịu dàng.',
	},
	{
		proverb: 'Đi một ngày đàng, học một sàng khôn.',
		wish: 'Cảm ơn bạn đã đi cùng tôi một đoạn. Chúc mỗi ngày đàng của bạn đều đầy một sàng khôn.',
	},
	{
		proverb: 'Học thầy không tày học bạn.',
		wish: 'Tôi viết để học, và hôm nay tôi có thêm một người bạn học. Chúc bạn gặp thật nhiều người bạn đáng quý.',
	},
	{
		proverb: 'Một miếng khi đói bằng một gói khi no.',
		wish: 'Có hôm viết xong tôi chẳng biết có ai đọc không, nên trái tim này quý lắm. Chúc bạn luôn gặp người giúp đúng lúc cần.',
	},
	{
		proverb: 'Thương người như thể thương thân.',
		wish: 'Bạn vừa dành chút thương cho một người viết chưa quen. Mong bạn cũng thương mình như thế, nhất là những ngày mệt.',
	},
	{
		proverb: 'Gần mực thì đen, gần đèn thì rạng.',
		wish: 'Được gần những người đọc như bạn, chữ của tôi cũng sáng lên đôi chút. Chúc quanh bạn luôn có nhiều ngọn đèn.',
	},
	{
		proverb: 'Chớ thấy sóng cả mà ngã tay chèo.',
		wish: 'Trái tim của bạn là thêm một mái chèo cho tôi. Chúc bạn vững tay qua mọi con sóng phía trước.',
	},
	{
		proverb: 'Sông có khúc, người có lúc.',
		wish: 'Nếu đây là lúc khó của bạn, mong bài viết đỡ được đôi phần. Còn nếu mọi sự đang thuận, chúc bạn thuận thật dài.',
	},
	{
		proverb: 'Nước chảy đá mòn.',
		wish: 'Tôi cứ viết đều từng bài, và có bạn ở đây thì càng muốn viết tiếp. Chúc sự kiên trì của bạn sớm được đền đáp.',
	},
	{
		proverb: 'Kiến tha lâu cũng đầy tổ.',
		wish: 'Mỗi trái tim là một hạt nhỏ tôi tha về tổ. Chúc những điều nhỏ bạn góp nhặt mỗi ngày sớm đầy lên.',
	},
	{
		proverb: 'Mưa dầm thấm lâu.',
		wish: 'Mong vài dòng hôm nay thấm dần và có ích với bạn vào một ngày nào đó. Chúc bạn luôn có thời gian chậm lại với điều mình thích.',
	},
	{
		proverb: 'Người ta là hoa đất.',
		wish: 'Và hôm nay, một đóa hoa đất vừa thả tim cho tôi. Chúc bạn luôn tươi tắn, đi đâu cũng được quý mến.',
	},
	{
		proverb: 'Ở hiền gặp lành.',
		wish: 'Người dành lời khen cho một kẻ lạ hẳn là người hiền. Chúc điều lành tìm đến bạn sớm hơn bạn nghĩ.',
	},
	{
		proverb: 'Đi cho biết đó biết đây,\nỞ nhà với mẹ biết ngày nào khôn.',
		wish: 'Cảm ơn bạn đã ghé góc nhỏ này trên đường đi của mình. Chúc bạn còn đi thật xa và về nhà thật vui.',
	},
	{
		proverb: 'Người trồng cây hạnh người chơi,\nTa trồng cây đức để đời về sau.',
		wish: 'Một lời khen nhỏ cũng là cây đức bạn vừa trồng. Chúc bóng mát của nó về lại với bạn và những người bạn thương.',
	},
	{
		proverb: 'Lá lành đùm lá rách.',
		wish: 'Chữ của tôi còn nhiều chỗ rách, vậy mà bạn vẫn đùm bọc bằng một trái tim. Chúc bạn được yêu thương như cách bạn đã cho đi.',
	},
	{
		proverb: 'Bán anh em xa, mua láng giềng gần.',
		wish: 'Từ nay mình xem nhau như láng giềng trên mạng nhé. Chúc nhà bạn luôn ấm và xóm giềng luôn hiền.',
	},
	{
		proverb: 'Uống nước nhớ nguồn.',
		wish: 'Đọc xong rồi bạn còn quay lại cảm ơn người viết, điều đó không nhiều người làm. Mong bạn luôn được ở gần những nguồn trong.',
	},
	{
		proverb: 'Bầu ơi thương lấy bí cùng,\nTuy rằng khác giống nhưng chung một giàn.',
		wish: 'Mình chưa từng gặp mà đã chung một giàn chữ. Mong ở đâu bạn cũng có vài người để nương vào nhau.',
	},
	{
		proverb: 'Nhiễu điều phủ lấy giá gương,\nNgười trong một nước phải thương nhau cùng.',
		wish: 'Một trái tim gửi cho người lạ cũng ấm như tấm nhiễu ấy. Mong những ngày trở lạnh luôn có ai đó phủ giúp bạn.',
	},
	{
		proverb: 'Ai ơi bưng bát cơm đầy,\nDẻo thơm một hạt, đắng cay muôn phần.',
		wish: 'Chữ cũng vậy, viết nhiều mà giữ lại chẳng bao nhiêu. Cảm ơn bạn đã nếm hạt này. Mong bữa cơm tối nay của bạn thật ngon.',
	},
	{
		proverb: 'Một điều nhịn, chín điều lành.',
		wish: 'Đọc đến tận đây giữa bao nhiêu thứ đang réo gọi đã là một điều nhịn. Mong chín điều lành đang trên đường đến với bạn.',
	},
	{
		proverb: 'Tốt gỗ hơn tốt nước sơn.',
		wish: 'Bài của tôi nước sơn chưa bóng, nên cảm ơn bạn đã nhìn vào phần gỗ. Mong những người quanh bạn cũng nhìn bạn như thế.',
	},
	{
		proverb: 'Giấy rách phải giữ lấy lề.',
		wish: 'Tôi chưa viết hay, chỉ cố giữ lấy lề là nói thật điều mình biết. Cảm ơn bạn đã tin. Mong bạn cũng luôn giữ được lề của mình.',
	},
	{
		proverb: 'Trăm hay không bằng tay quen.',
		wish: 'Những dòng này chưa hay, chỉ là tay đang quen dần. Cảm ơn bạn đã ngồi xem tôi tập. Mong việc bạn đang tập cũng sớm thành quen.',
	},
	{
		proverb: 'Học ăn, học nói, học gói, học mở.',
		wish: 'Viết cũng phải học từng chút, nhất là học gói lại cho gọn. Cảm ơn bạn đã kiên nhẫn mở ra đọc. Mong thư nào đến tay bạn cũng là tin vui.',
	},
	{
		proverb: 'Lửa thử vàng, gian nan thử sức.',
		wish: 'Cảm ơn bạn đã ghé. Nếu bạn đang ở đoạn gian nan, mong mấy dòng này là một chỗ nghỉ chân. Vàng thì rồi sẽ sáng.',
	},
	{
		proverb: 'Trăng bao nhiêu tuổi trăng già,\nNúi bao nhiêu tuổi gọi là núi non.',
		wish: 'Những bài viết này còn non lắm, vậy mà bạn vẫn ghé. Mong ở tuổi nào bạn cũng còn thấy trăng đẹp.',
	},
	{
		proverb: 'Ai ơi chớ bỏ ruộng hoang,\nBao nhiêu tấc đất, tấc vàng bấy nhiêu.',
		wish: 'Góc nhỏ này còn vắng, nên mỗi lần bạn ghé là thêm một tấc vàng. Mong mảnh đất của riêng bạn luôn có người chăm.',
	},
	{
		proverb: 'Rủ nhau đi cấy đi cày,\nBây giờ khó nhọc, có ngày phong lưu.',
		wish: 'Tôi còn khó nhọc với từng câu chữ, nhưng có bạn rủ rê thì nhẹ hơn nhiều. Mong ngày phong lưu của bạn đến sớm.',
	},
	{
		proverb: 'Chị ngã em nâng.',
		wish: 'Tôi chưa ngã, nhưng trái tim này vẫn là một bàn tay nâng. Mong lúc cần, bạn cũng có người đỡ ngay bên cạnh.',
	},
	{
		proverb: 'Yêu nhau mấy núi cũng trèo,\nMấy sông cũng lội, mấy đèo cũng qua.',
		wish: 'Giữa bao nhiêu thứ để đọc, bạn đã trèo tới tận cuối bài này. Mong đường đến những người bạn thương luôn thật gần.',
	},
	{
		proverb: 'Thuyền về có nhớ bến chăng,\nBến thì một dạ khăng khăng đợi thuyền.',
		wish: 'Góc nhỏ này vẫn ở đây, bạn ghé lúc nào cũng được. Mong chuyến đi nào của bạn cũng có một bến để về.',
	},
	{
		proverb: 'Qua đình ngả nón trông đình,\nĐình bao nhiêu ngói thương mình bấy nhiêu.',
		wish: 'Bạn đi ngang mà còn ngả nón chào một cái. Ngói thì tôi đếm không xuể, nên chỉ xin gửi lời cảm ơn.',
	},
	{
		proverb: 'Gió đưa cành trúc la đà,\nTiếng chuông Trấn Vũ, canh gà Thọ Xương.',
		wish: 'Câu này chẳng liên quan gì đến bài viết, tôi chỉ muốn gửi bạn chút gió ấy. Mong hôm nay của bạn có một phút la đà.',
	},
	{
		proverb: 'Đường vô xứ Nghệ quanh quanh,\nNon xanh nước biếc như tranh họa đồ.',
		wish: 'Đường đến góc nhỏ này hẳn cũng quanh quanh, vậy mà bạn đã tới. Mong phía trước của bạn còn nhiều non xanh.',
	},
	{
		proverb: 'Trong đầm gì đẹp bằng sen,\nLá xanh bông trắng lại chen nhị vàng.',
		wish: 'Giữa mạng ồn ào, một trái tim lặng lẽ thế này cũng là sen. Mong quanh bạn lúc nào cũng có một chỗ yên.',
	},
];

export type ThanksMessage = (typeof THANKS_MESSAGES)[number];

/** Never repeats the message just shown, so hearting twice always reads as something new. */
export const pickThanksMessage = (previous?: ThanksMessage) => {
	const pool = THANKS_MESSAGES.filter((message) => message !== previous);
	return pool[Math.floor(Math.random() * pool.length)];
};
