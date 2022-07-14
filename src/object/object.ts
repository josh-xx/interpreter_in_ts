export interface ObjectBase {
}

export class ObjectInteger implements ObjectBase {
    constructor(
        public value: number,
    ) {}

    inspect() {
        return this.value
    }
}

export class ObjectBoolean implements ObjectBase {
    constructor(
        public value: boolean,
    ) {}

    inspect() {
        return this.value
    }
}

export class ObjectNull implements ObjectBase {
    constructor(
    ) {}

    inspect() {
        return null
    }
}
