export const checkBlockCollision = (blockInfo, board) => {
    const {startX, startY, endX, endY, tiles} = blockInfo
    for(let y = startY, y2=0; y<endY;y++,y2++){
        for(let x = startX, x2 = 0; x<endX; x++, x2++){
            if (y < 0 || x < 0) continue
            if(tiles[y2][x2] !== 0 && board[y][x] !== 0) return true
        }
    }
    return false
}

export const checkBlockWithInArea = (blockInfo, board) => {
    const { startX , startY, endX, endY, tiles } = blockInfo
    const blockHeight = tiles.length
    const blockWidth = tiles[0].length
    const boardHeight = board.length
    const boardWidth = board[0].length

    if (startX < 0) {
        for (let y=0; y<blockHeight;y++) {
            for (let x=0;x<0-startX;x++) {
                if(tiles[y][x] !== 0) {
                    return false
                }
            }
        }
    }

    if(endX > boardWidth) {
        for(let y = 0 ; y < blockHeight; y++) {
            for(let x = blockWidth-(endX-boardWidth); x < blockWidth; x++) {
                if(tiles[y][x] !== 0) {
                    return false
                }
            }
        }
    }

    if(startY < 0){
        for (let y = 0; y < 0 - startY; y++ ){
            for (let x = 0; x < blockWidth; x++) {
                if(tiles[y][x] !== 0) {
                    return false
                }
            }
        }
    }

    if (endY > boardHeight) {
        for(let y = blockHeight-(endY-boardHeight); y< blockHeight; y++) {
            for(let x = 0; x < blockWidth; x++) {
                if(tiles[y][x] !== 0) {
                    return false
                }
            }
        }
    }

    return true
}