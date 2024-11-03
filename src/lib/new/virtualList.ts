/** * Virtual List Core Calculating Center */

const DIRECTION_TYPE = {
  FRONT: "FRONT", // Scroll up or left
  BEHIND: "BEHIND", // Scroll down or right
};

const CALC_TYPE = {
  INIT: "INIT",
  FIXED: "FIXED",
  DYNAMIC: "DYNAMIC",
};

const LEADING_BUFFER = 2;

type Range = {
  start: number;
  end: number;
  padFront: number;
  padBehind: number;
};

type Param = {
  keeps: number;
  slotHeaderSize: number;
  uniqueIds: any[];
  buffer: number;
  estimateSize: number;
  [key: string]: any;
};

export default class VirtualList {
  private param: Param;
  private callUpdate: (range: Range) => void | null;

  private firstRangeTotalSize = 0;
  private firstRangeAverageSize = 0;
  private lastCalcIndex = 0;
  private fixedSizeValue = 0;
  private calcType = CALC_TYPE.INIT;

  private offset = 0;
  private direction = "";

  // Current render range
  private range: Range = { start: 0, end: 0, padFront: 0, padBehind: 0 };

  // Size data storage
  private sizes = new Map();

  constructor(param: Param, callUpdate: (range: Range) => void) {
    this.param = param;
    this.callUpdate = callUpdate;

    if (param) {
      this.checkRange(0, param.keeps - 1);
    }
  }

  private isBehind(): boolean {
    return this.direction === DIRECTION_TYPE.BEHIND;
  }

  private isFront(): boolean {
    return this.direction === DIRECTION_TYPE.FRONT;
  }

  // Get start index offset
  private getOffset(start: number): number {
    return (
      (start < 1 ? 0 : this.getIndexOffset(start)) + this.param.slotHeaderSize
    );
  }

  public updateParam(key: keyof Param, value: any): void {
    if (this.param && key in this.param) {
      if (key === "uniqueIds") {
        this.updateUniqueIds(value);
      }
      this.param[key] = value; // Update parameter
    }
  }

  private updateUniqueIds(value: any[]): void {
    this.sizes.forEach((_, id) => {
      if (!value.includes(id)) {
        this.sizes.delete(id);
      }
    });

    // Save each size map by id
    value.forEach((id) => {
      if (!this.sizes.has(id)) {
        this.sizes.set(id, this.fixedSizeValue); // Default size
      }
    });

    // Handle size calculation logic based on current state
    this.handleSizeCalculation();
  }

  private handleSizeCalculation(): void {
    const currentSizeCount = this.sizes.size;

    if (this.calcType === CALC_TYPE.INIT) {
      if (currentSizeCount > 0) {
        this.fixedSizeValue = [...this.sizes.values()][0]; // Assume first size as fixed
        this.calcType = CALC_TYPE.FIXED;
      }
    } else if (this.calcType === CALC_TYPE.FIXED && currentSizeCount > 1) {
      const differentSizes = [...this.sizes.values()].filter(
        (size) => size !== this.fixedSizeValue,
      );
      if (differentSizes.length > 0) {
        this.calcType = CALC_TYPE.DYNAMIC; // Switch to dynamic sizing
      }
    }

    // Calculate average size only in the first range
    if (
      this.calcType !== CALC_TYPE.FIXED &&
      typeof this.firstRangeTotalSize !== "undefined"
    ) {
      if (
        currentSizeCount <
        Math.min(this.param.keeps, this.param.uniqueIds.length)
      ) {
        this.firstRangeTotalSize = [...this.sizes.values()].reduce(
          (acc, val) => acc + val,
          0,
        );
        this.firstRangeAverageSize = Math.round(
          this.firstRangeTotalSize / currentSizeCount,
        );
      }
    }
  }

  // Additional methods like handleDataSourcesChange(), handleScroll(), etc., would follow the same pattern of refactoring
}
