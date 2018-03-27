
# Javascript排序

- [冒泡排序](#冒泡排序)
- [选择排序](#选择排序)
- [插入排序](#插入排序)

## 冒泡排序

> 冒泡排序，相邻两个值两两进行比较，每次循环从第一个位置开始，相邻值比较，最终可以确定最后一位为最大的或最小的，进行下次循环可以绕过上次确定的最后一位的位数，从时间复杂度上可以进行优化。

```js
{
    let arr = [9, 5, 3, 7, 2, 4, 8, 1, 6];

    for(let i=0; i<arr.length; i++){
        for(let j=0; j<arr.length - 1 - i; j++){
            if(arr[j] > arr[j + 1]){
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }

    console.log(arr); // [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
}
```
## 选择排序

> 循环n-1次，每次循环从第一位依次确定最小值或最大值

```js
{
    let arr = [9, 5, 3, 7, 2, 4, 8, 1, 6];
    let minIndex, temp;

    for(let i=0; i<arr.length - 1; i++){
        minIndex = i;

        for(let j=i+1; j<arr.length; j++){
            if(arr[j] < arr[minIndex]){
                minIndex = j;
            }
        }

        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }

    console.log(arr); // [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
}
```

## 插入排序

> 取出第一位数做为有序序列，之后的所有数据作为无序序列循环比较，插入到符合条件之前。

```js
{
    let arr = [9, 5, 3, 7, 2, 4, 8, 1, 6];
    let current, j;
    for(let i=1; i<arr.length; i++){
        j = i;
        current = arr[i];

        while(j > 0 && current < arr[j - 1]){
            arr[j] = arr[j - 1];
            j--;
        }

        arr[j] = current;
    }

    console.log(arr); // [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
}
```

## sort.js 选择排序

```js

const arr = [9, 5, 3, 7, 2, 4, 8, 1, 6];

// 深度拷贝
function copy(elments){
    let newElments = elments instanceof Array ? [] : {};

    for(let key in elments){
        newElments[key] = typeof elments[key] === 'object' ? copy(elments[key]) : elments[key];
    }

    return newElments;
}

// Sort构造函数主要用于初始化this对象
function Sort(arr){
    if(!arr){
        throw new Error('The parameter cannot be empty!');
    }

    if(!Array.isArray(arr)){
        throw new Error('Invalid type array!');
    }

    this.arr = arr;
    this.len = arr.length;
}

//注意：使用箭头函数会改变this的指向
//冒泡排序，相邻两个值两两进行比较，每次循环从第一个位置开始，相邻值比较，最终可以确定最后一位为最大的或最小的，进行下次循环可以绕过上次确定的最后一位的位数，从时间复杂度上可以进行优化。
Sort.prototype.bubbling = function(){
    //定义当前作用域下的数组，避免污染this.arr变量
    let arr = copy(this.arr);

    for(let i=0; i<this.len; i++){
        for(let j=0; j<this.len - 1 - i; j++){
            if(arr[j] > arr[j + 1]){
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }

    return arr;
}

// 选择排序
// 循环n-1次，每次循环从第一位依次确定最小值或最大值
Sort.prototype.choose = function(){
    let arr = copy(this.arr);
    let minIndex, temp;

    for(let i=0; i<this.len - 1; i++){
        minIndex = i;

        for(let j=i+1; j<this.len; j++){
            if(arr[j] < arr[minIndex]){
                minIndex = j;
            }
        }

        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }

    return arr;
}

// 插入排序
// 取出第一位数做为有序序列，之后的所有数据作为无序序列循环比较，插入到符合条件之前。
Sort.prototype.insert = function(){
    let arr = copy(this.arr);
    let current, j;
    for(let i=1; i<this.len; i++){
        j = i;
        current = arr[i];

        while(j > 0 && current < arr[j - 1]){
            arr[j] = arr[j - 1];
            j--;
        }

        arr[j] = current;
    }

    return arr;
}

let s = new Sort(arr);

console.log(s.bubbling());
console.log(s.choose());
console.log(s.arr);
console.log(s.insert());

```