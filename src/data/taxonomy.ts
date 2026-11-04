// Single source of truth for the content taxonomy.
// Keep the options in public/admin/config.yml in sync with these slugs.

export const CATEGORIES = [
	{
		slug: 'quan-sat',
		label: 'Quan sát',
		description: 'Ghi lại điều thấy ở môi trường điều hành: cách lãnh đạo họp, quyết định, giao việc.',
		metaDescription: 'Ghi chép từ môi trường điều hành doanh nghiệp: cách lãnh đạo họp, ra quyết định và giao việc, nhìn bằng con mắt của một người đang học quản trị.',
	},
	{
		slug: 'cau-hoi',
		label: 'Câu hỏi',
		description: 'Những điều chưa hiểu, đang thắc mắc.',
		metaDescription: 'Những câu hỏi chưa có lời giải về lãnh đạo và quản trị doanh nghiệp: điều người viết chưa hiểu, đang thắc mắc và còn phải tìm hiểu thêm.',
	},
	{
		slug: 'nghien-cuu',
		label: 'Nghiên cứu',
		description: 'Đào sâu bản chất, đối chiếu sách, mô hình, nghiên cứu.',
		metaDescription: 'Đào sâu bản chất các vấn đề quản trị: đối chiếu sách, mô hình và nghiên cứu về lãnh đạo, ra quyết định, tài chính và vận hành doanh nghiệp.',
	},
	{
		slug: 'bai-hoc',
		label: 'Bài học',
		description: 'Hệ thống hóa thành bài có cấu trúc, dành cho SME và quản lý trẻ.',
		metaDescription: 'Bài học có cấu trúc về lãnh đạo và quản trị, hệ thống hóa từ quan sát và nghiên cứu, dành cho chủ doanh nghiệp SME và quản lý trẻ.',
	},
	{
		slug: 'nhat-ky-hoc-tap',
		label: 'Nhật ký học tập',
		description: 'Ghi chú ngắn, nhìn lại quá trình, điều đã thay đổi trong suy nghĩ.',
		metaDescription: 'Ghi chú ngắn trên hành trình học lãnh đạo và quản trị: nhìn lại quá trình, những nhận định đã sửa và điều đã thay đổi trong suy nghĩ.',
	},
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];

export const TAGS = [
	{ slug: 'ra-quyet-dinh', label: 'Ra quyết định' },
	{ slug: 'xay-doi-ngu', label: 'Xây đội ngũ' },
	{ slug: 'giao-tiep', label: 'Giao tiếp' },
	{ slug: 'van-hoa', label: 'Văn hóa' },
	{ slug: 'tai-chinh', label: 'Tài chính' },
	{ slug: 'van-hanh', label: 'Vận hành' },
] as const;

export const CONFIDENCE_LEVELS = [
	{ slug: 'quan-sat-ban-dau', label: 'Quan sát ban đầu' },
	{ slug: 'da-tim-hieu-them', label: 'Đã tìm hiểu thêm' },
	{ slug: 'da-kiem-chung', label: 'Đã kiểm chứng' },
] as const;

type Item = { readonly slug: string; readonly label: string };

/** Slugs as the non-empty tuple that z.enum() expects. */
export const slugsOf = <T extends readonly Item[]>(items: T) =>
	items.map((item) => item.slug) as unknown as [T[number]['slug'], ...T[number]['slug'][]];

export const labelOf = (items: readonly Item[], slug: string) =>
	items.find((item) => item.slug === slug)?.label ?? slug;
