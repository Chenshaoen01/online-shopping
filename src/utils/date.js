// 固定以台北時區格式化，避免伺服器與瀏覽器所在時區不同而顯示出不一樣的日期
const dateFormatter = new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
})

export const formatDate = (dateTime) => dateFormatter.format(new Date(dateTime))
