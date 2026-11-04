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
];

export type ThanksMessage = (typeof THANKS_MESSAGES)[number];

/** Never repeats the message just shown, so hearting twice always reads as something new. */
export const pickThanksMessage = (previous?: ThanksMessage) => {
	const pool = THANKS_MESSAGES.filter((message) => message !== previous);
	return pool[Math.floor(Math.random() * pool.length)];
};
