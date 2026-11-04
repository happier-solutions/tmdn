// Single source of truth for the content taxonomy.
// Keep the options in public/admin/config.yml in sync with these slugs.

export const CATEGORIES = [
	{
		slug: 'quan-sat',
		label: 'Quan sát',
		description: 'Ghi lại điều thấy ở môi trường điều hành: cách lãnh đạo họp, quyết định, giao việc.',
	},
	{
		slug: 'cau-hoi',
		label: 'Câu hỏi',
		description: 'Những điều chưa hiểu, đang thắc mắc.',
	},
	{
		slug: 'nghien-cuu',
		label: 'Nghiên cứu',
		description: 'Đào sâu bản chất, đối chiếu sách, mô hình, nghiên cứu.',
	},
	{
		slug: 'bai-hoc',
		label: 'Bài học',
		description: 'Hệ thống hóa thành bài có cấu trúc, dành cho SME và quản lý trẻ.',
	},
	{
		slug: 'nhat-ky-hoc-tap',
		label: 'Nhật ký học tập',
		description: 'Ghi chú ngắn, nhìn lại quá trình, điều đã thay đổi trong suy nghĩ.',
	},
] as const;

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
