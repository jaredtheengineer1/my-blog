---
title: "Structs and Enums and Pattern Matching, oh my!"
date: 2025-12-28
tags: [meta, learning]
description: "The Rust Book, chapters 5 and 6."
---

## Structs

I misunderstood structs in my last post. Looking at only a couple of examples before actually reading the chapter on structs, but that's being rectified this week.
Mistaken information: 
```
`Structs` are "heterogeneous producs of other types". What? It's an object with multiple props that are each the same type. Think of a Rectangle, or something.
```
A struct can comprise multiple data types. This is more like the object that you're probably familar with already, and makes a lot more sense to me than an object compsed of only one type. 

Example:
```
struct Person {
  name: String,
  age: u8, // 0 - 255
  ...
}
```

Structs don't appear to be a data type that you can extend through shadowing.  In the case of a struct, if you need more data then you should create a new struct.
```
struct A {
  some_data: String,
  some_more_date: u8
}

struct B {
  additional_data: String,
  original_data: A
}
```

Structs also have a short hand for field initiation. This, again, feels very familiar to me as a JavaScript/TypeScript dev.

```
let some_data = "thing";

let x = My_strut {
  some_data,
  some_more_data: 8
}
```

This is an efficient way to write
```
let some_data = "thing";

let x = My_struct {
  some_data: some_data,
  some_more_data: 8
}
```

But wait! There's more!
You don't have to name your properties?
You can write a struct that is a tuple?
```
struct Color(i32, i32, i32);
```
While I guess this can make sense in some instances (like the example above where people reading your code will likely associate those with RGB), in general I think this will be a *bad idea*. Part of what's nice, in my opinion, about structs is that they sort of give your code a nice, self-documenting quality.

The book also gives the following example:
```
struct Point(i32, i32, i32);
```
I don't typically jump straight to `(X, Y, Z)` coordinates when I think of a point. Maybe that's a failing on my part, but I don't think that's as clear as it could be.

I prefer 
```
struct Color {
  R: i32,
  G: i32,
  B: i32
}
```

I've got a ways to go in The Rust book yet before I learn about `traits`, but apparently there is a `unit-like` struct that can be used when you want to implement a `trait`, but don't yet hae data to store on the type.

```
struct AlwaysEqual;

fn main() {
  let subject = AlwaysEqual;
}
```

Is this going to keep track of some global state? I'm not sure why I'd want to declare this variable here without data, except to be added later.


## Enums

As expected, these are a custom type.  In TypeScript, I would define
```
enum IpAddrKind {
  V4 = 'V4',
  V6 = 'V6'
}

//accessed as 
let current_ip_type = IpAddrKind.V4;
```
or optionally not initialize them to a string for 0 based indexing. In Rust, it's very similar:
```
#[derive(Debug)]
enum IpAddrKind {
    V4,
    V6,
}
fn main() {
    let four = IpAddrKind::V4;
    let six = IpAddrKind::V6;
    println!("{:?} {:?}",four, six)
}
```
The above code creates the enum with the debug trait (I think it's a trait?) so that i can print it out. 

Note that the rust `enum` doesn't take an assignment. I tried in an online editor at `tutorialspoint` and it failed with 
```
#[derive(Debug)]
enum Test {
    Some = String::from("thing"),
    Is = String::from("wrong")
}
fn main() {
    let x = Test::some;
    let y = Test::is;
    println!("Hello, World! {:?} {:?}", x, y);
}

.....
Compilation Error:
error[E0308]: mismatched types
 --> main.rs:3:16
  |
3 |         Some = String::from("thing"),
  |                ^^^^^^^^^^^^^^^^^^^^^ expected isize, found struct `std::string::String`
  |
  = note: expected type `isize`
             found type `std::string::String`

error[E0308]: mismatched types
 --> main.rs:4:14
  |
4 |         Is = String::from("wrong")
  |              ^^^^^^^^^^^^^^^^^^^^^ expected isize, found struct `std::string::String`
  |
  = note: expected type `isize`
             found type `std::string::String`

error: aborting due to 2 previous errors

For more information about this error, try `rustc --explain E0308`.
```

I tried with a couple of different variable types, and assigning directly as a string instead of `String::from(...)`. No dice.

## Matching

I like Rust's `match` keyword.  I have a bit of hands on experience from Chapter 2 of The Rust Book, where we built a ["Guess the Number" game](https://github.com/jaredtheengineer1/learn-rust/blob/master/chapter-2/guessing_game/src/main.rs).

In the simple game, you compared 2 integers with built in `Ordering` arguments from the standard library.  In this chapter, however, it takes a look at comparing `enums`.  This is a realy good look, I think.  

The book example:
```
enum Coin {
  Penny,
  Nickel,
  Dime,
  Quarter
}

fn value_in_cents(coin: Coin) -> u8 {
  match coin {
    Coin::Penny => 1,
    Coin::Nickel => 5,
    Coin::Dime => 10,
    Coin::Quarter => 25
  }
}
```

Let's break it down.

First is the `enum` for `Coin`. This defines common US coins by name. Next, in our `value_in_cents` function, we take a single param: `coin:Coin`. This function accepts a single value that must be withint the `Coin` enum to be valid.  Finally, the match statement. It mateches the coin (`match coin`) and maps it to a value in the enum.  When it finds the correct match, it returns a defined value.  

You would probably run this in a loop to count change or, conversly, change the function to accept an array of values and keep track of the running total to return at the end. 

You can find my very simple version of this in my [learn-rust repo](https://github.com/jaredtheengineer1/learn-rust/blob/master/chapter-5/enum/main.rs).

I sort of cheated and looked up a couple of traits to make it easier to do.  It's easy to break, it doesn't convert change over .99 cents to dollars - it's basic. I chose to use `i8` because you can't return a negative total. The least you can have is 0. 

Fun note:
As of the time of this writing the return from the `value_in_cents` function is on line 20. If you put a semi-color after `total`...it breaks. `total;` is a statment returning `()`, while `total` is the value of the variable `total`.  Do not put a semi-colon after the final return value unless you plan on writing `return total;`.  