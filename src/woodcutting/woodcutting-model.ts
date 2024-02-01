import { WoodcuttingTree } from '../database/trees'

export class WoodcuttingModel {
  constructor(private trees: WoodcuttingTree[]) {}

  getTrees() {
    return this.trees
  }

  getTreeById(id: string) {
    const tree = this.trees.find((tree) => tree.id === id)
    if (!tree) {
      throw new Error(`Could not find tree with id ${id}`)
    }
    return tree
  }
}
