import { Image, Pixel } from "./Image";


export type Node = (inputs: NodeConnectors) => NodeConnectors

export type NodeConnectors = {[name: string]: Image<Pixel>}
