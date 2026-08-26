const FILE_URL = process.env.NEXT_PUBLIC_FILE_URL

export const imageUrl = (fileName) => fileName ? `${FILE_URL}/${fileName}` : '/no-image.png'

export const backgroundImage = (fileName) => ({ backgroundImage: `url('${imageUrl(fileName)}')` })
