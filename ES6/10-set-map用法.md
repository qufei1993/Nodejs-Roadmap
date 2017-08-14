### set map数据结构

> 在整个的数据开发过程中，涉及到数据结构，能使用map不适用数组，尤其是复杂的数据结构，如果对数据结构要求存储的数据有唯一性考虑使用set

* set  
集合中的数据是唯一的
```javascript
{
  let list = new Set();
  list.add(5);
  list.add(7);
  //size 相当于数组中的length
  console.log('size',list.size); //2
}

{
  let arr = [1,2,3,4,5];
  let list = new Set(arr);
  console.log('size',list.size); //5
}

{
  //会自己去重
  let list = new Set();
  list.add(1);
  list.add(2);
  list.add(1);
  console.log('list',list); //list Set {1, 2}

  //数字2 与 字符串'2'严格意义上是不相等的
  let arr=[1,2,3,1,'2'];
  let list2=new Set(arr);
  console.log('unique',list2); //unique Set {1, 2, 3, "2"}
  
  //以数组的形式输出
  console.log([...list2]);   // (4) [1, 2, 3, "2"]

}
```
四个方法add delete clear has  
add 添加一个元素  
delete 删除一个元素  
clear 清空所有元素  
has 查看集合中是否包含指定元素  
```javascript
{
  let arr=['add','delete','clear','has'];
  let list=new Set(arr);
  list.add('add1');
  console.log('has',list.has('add')); //has true
  console.log('delete',list.delete('add'),list); //delete true Set {"delete", "clear", "has", "add1"}
  list.clear();
  console.log('list',list); //list Set {}
}
```
集合遍历  
```javascript
{
  let arr=['add','delete','clear','has'];
  let list=new Set(arr);

  for(let key of list.keys()){
    console.log('keys',key);
  }
  //keys add keys delete 5 keys clear  keys has

  for(let value of list.values()){
    console.log('value',value);
  }
  //value add  value delete  value clear  value has

  for(let [key,value] of list.entries()){
    console.log('entries',key,value);
  }
  //entries add add  entries delete delete  entries clear clear  entries has has

  list.forEach(function(item){console.log(item);})
  //add  delete  clear  has
}
```
* WeakSet  
weakset的元素只能是对象，WeakSet中的对象是弱引用，只是把地址拿过来，没有clear属性，不能遍历
```javascript
{
  let weakList=new WeakSet();
  let arg={a:'1'};
  weakList.add(arg);
  weakList.add({b:'2'});
  console.log('weakList',weakList);
  //weakList WeakSet {Object {b: "2"}, Object {a: "1"}}
}
```
* map  
map中的key可以是任意数据类型：字符串、数组、对象等
要注意set添加元素用add(),而map添加元素用set()
```javascript
{
  //第一种定义方式
  let map = new Map();
  let arr=['123'];
  map.set(arr,456);
  console.log('map',map,map.get(arr));
  //map Map {["123"] => 456} 456
}
{
  //第二种定义方式
  let map = new Map([['a',123],['b',456]]);
  console.log('map args',map);
  //map args Map {"a" => 123, "b" => 456}

  //size delete clear方法 与 遍历同set一样
  console.log('size',map.size); //size 2
  console.log('delete',map.delete('a'),map); //delete true Map {"b" => 456}
  map.clear();
  console.log('clear',map); //clear Map {}
}
```
* WeakMap  
同WeakSet一样接收的key值必须是对象，没有size属性，clear方法，也是不能遍历
```javascript
{
  let weakmap=new WeakMap();
  let o={};
  weakmap.set(o,123);
  console.log(weakmap.get(o)); //123
}
```
map与array增，查，改，删对比
```javascript
{
  // 数据结构横向对比，增，查，改，删
  let map=new Map();
  let array=[];
  // 增
  map.set('t',1);
  array.push({t:1});
  console.info('map-array',map,array);
  //map-array Map {"t" => 1} [Object]

  // 查
  let map_exist=map.has('t');
  let array_exist=array.find(item=>item.a);
  console.info('map-array',map_exist,!!array_exist);
  //map-array true false

  // 改
  map.set('t',2);
  array.forEach(item=>item.t?item.t=2:'');
  console.info('map-array-modify',map,array);
  //map-array-modify Map {"t" => 2} [Object]

  // 删
  map.delete('t');
  let index=array.findIndex(item=>item.t);
  array.splice(index,1);
  console.info('map-array-empty',map,array);
  //map-array-empty Map {} []
}
```
set与array增，查，改，删对比
```javascript
{
  // set和array的对比
  let set=new Set();
  let array=[];

  // 增
  set.add({t:1});
  array.push({t:1});
  console.info('set-array',set,array);
  //set-array Set {Object {t: 1}} [Object]

  // 查
  let set_exist=set.has({t:1}); //没有对象引用，将一直为false
  let array_exist=array.find(item=>item.t);
  console.info('set-array',set_exist,array_exist);
  //set-array false Object {t: 1}

  // 改
  set.forEach(item=>item.t?item.t=2:'');
  array.forEach(item=>item.t?item.t=2:'');
  console.info('set-array-modify',set,array);
  //set-array-modify Set {Object {t: 2}} [Object]

  // 删
  set.forEach(item=>item.t?set.delete(item):'');
  let index=array.findIndex(item=>item.t);
  array.splice(index,1);
  console.info('set-array-empty',set,array);
  //set-array-empty Set {} []
}
```
map,set,object对比
```javascript
{
  let item={t:1};
  let map=new Map();
  let set=new Set();
  let obj={};

  // 增
  map.set('t',1);
  set.add(item);
  obj['t']=1;
  console.info('map-set-obj',obj,map,set);
  //map-set-obj Object {t: 1} Map {"t" => 1} Set {Object {t: 1}}

  // 查
  console.info({
    map_exist:map.has('t'),
    set_exist:set.has(item),
    obj_exist:'t' in obj
  })
  //Object {map_exist: true, set_exist: true, obj_exist: true}

  // 改
  map.set('t',2);
  item.t=2;
  obj['t']=2;
  console.info('map-set-obj-modify',obj,map,set);
  //map-set-obj-modify Object {t: 2} Map {"t" => 2} Set {Object {t: 2}}

  // 删除
  map.delete('t');
  set.delete(item);
  delete obj['t'];
  console.info('map-set-obj-empty',obj,map,set);
  //map-set-obj-empty Object {} Map {} Set {}
}
```
