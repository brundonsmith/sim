
export type Resolution = [ number, number ]

export type Color = [ number, number, number ]

export type ColorImage = Array<Array<Color>>

export type Gray = number

export type GrayscaleImage = Array<Array<Gray>>



export type Node = (inputs: NodeConnectors) => NodeConnectors

export type NodeConnectors = {[name: string]: ColorImage|GrayscaleImage}
