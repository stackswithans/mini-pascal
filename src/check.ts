import * as ast from "./ast";

function typeCast<T extends ast.NodeData>(
    node: ast.NodeData,
    kind: ast.NodeKind
): node is T {}

export class Checker {
    check<T extends ast.NodeData>(node: ast.Node<T>) {
        switch (node.nodeKind) {
            case ast.NodeKind.Program: {
                this.checkBlock();
            }
        }
    }

    private checkBlock(block: ast.Block) {}
}
