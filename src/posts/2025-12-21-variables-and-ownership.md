---
title: "My First Week of Rust"
date: 2025-12-21
tags: [meta, learning]
description: "Variables and Ownership"
---


## Variables

Variables are pretty common, right? If you've been programming
for literally any amount of time, you used a variable.  The only 
examle that I can think of where that isn't true, is if you 
stopped at "Hello, World!" Even that one uses variables in some
tutorials.

Where it differs: I've been using JavaScript and TypeScript for 
the last few years. Yes, TypeScript has types, but it doesn't
*require* that you use them, and while JavaScript has types, if
you aren't using something lik JSDoc, it doesn't care. 

Rust is a statically typed language, though. while you can create
a variable without assigning it to a type, if you try to change 
it's type later...you fail. Think of it like `var` in C#. Unless 
you use a `const`, those are required to have a type declared. 

Unlike the environment I've been using the last few years, rust 
is immutable by default.  In JavaScript/TypeScript, i have to 
declare a `const`. While Rust does have a `const` variable type, 
your variable doesn't have to specifically be called a `const` to 
make it immutable. It's just the opposite actually.  That's sort 
of neat. You have to intentionally set it to a mutable state using 
`mut`. That makes it a very consious choice, and makes you consider 
programming choices differently. 

Another fun thing that I've found is the idea of shadowing. Again -
JavaScript/TypeScript has been my primary for the last few years. We 
don't get overloading, and that's what this feels like to me - just 
at the variable level instaed of the function level. You can, in different 
scopes, change not just the value, but the type of the variable to suit a 
need. 

"Well, why would you want to change the type, anyway? What was the point of 
creating it as a string just to use it as a number later?"  Great question, 
glad you asked.  In the 2nd chapter of [The Rust Book]('https://doc.rust-lang.org/stable/book/ch02-00-guessing-game-tutorial.html), 
we built a guessing game. This is a simple example, but it does demonstrate 
a how and why you would want to shadow.  The user inputs a number and it's 
captured as a string.  But the secret number that was generated was a number. 
We need to be able to compare the 2 easily and safely.  It doesn't seem like '
there is a way to compare numbers to strings the way you would in JavaScript (`==`), 
at least in my limited time and scope in learning Rust. So we convert it to a 
number, first, then compare the 2. That's accomplished by shadowing.

Maybe there's a way to specifiy what the expected data 
type is, and I just don't know it. I'll have to look into that. I'll also have to 
look into different levels of equality, like what's available in JS and TS.  Gotta' 
get some more knowledge. 

Well, anyway, Rust has the basics:
- `integers`
- `floats`
- `booleans`
- `chars`

But integers can easily be broken into smaller groups.
|Length|Signed|Unsigned|
|------|------|--------|
|8-bit|i8|u8|
|16-bit|i16|u16|
|32-bit|i32|u32|
|...|...|...|

and the same for 64, and 128 bit integers, and floats (`f8`,`f16`, etc).

At least Rust uses the `let` keyword for variables. That feels very familiar.

You also have somre more advanced types like
- `Arrays`
- `Tuples`
- `Enums`
- `Strcts`

`Tuples` are your basic, multi type variable: 

```
let my_tuple: (str, bool, u32, f32) = ('this is a tuple', true, 800, 2.2)
```

`Structs` are "heterogeneous producs of other types". What? It's an object with multiple props that are each the same type. Think of a Rectangle, or something.

```
struct Rectangle {
  top_left_x: i32,
  top_left_y: i32,
  bottom_right_x: i32
  bottom_right_y: i32
}
```

One last thing to note about variables. The JavaScript/TypeScript convention is to use 
`camelCase` for variable names, and the Rust convention seems to be `snake_case`.  Semantics, 
I know. Both languages will take the variable in whatever fashion you give it, but it's been 
an exercise, "having" to go back and try and correct my variable names.

## Functions
`return`? A thing of the past. All you need to do in Rust is have the last line of a function, and to declare a return type of the function. That last part feels familiar to my TypeScript. While not required, it is good form.
```
fn add_two_numbers(a: u32, b: u32) -> u32 {
  a + b
}

fn main() {
  let a: u32 = 5;
  let b: u32 = 10;
  println!("The return value of {} + {} = {}!", a, b, add_two_numbers(a,b)); 
  //returns 15
  /*the values "{}" are used for string interpolation. you can put a value directly inside "{a}", or you can do as I did and add a comma separated list in the order you want them displayed after the print string
}
```
Easy, right?

## Ownership
The Rust book claims that this is new concept to many programmers. I will count myself as one of those to whom this is new.  It's Rust's way of managing memory while running. The Rust book goes on to say "When you understand ownership, you'll have a solid foundation for understanding the features that make Rust unique."

It (Rust) doesn't do garbage collection, and you don't manually free up resources. Instead, you set up a set of rules that the compiler will follow. This applies to both the stack, and the heap.

The rules that I need to keep in mind:

- Each value in Rust has an *owner*
- There can only be one owner at a time
- When the owner goes out of scope, the value will be dropped

The simplist example is just variable scope.
If you declare a variable in a function, it's scope is only viable within that function after it's declaration.  We see that in the shadowing example from Chapter 3 of The Rust Book - you can see [my example here](https://github.com/jaredtheengineer1/learn-rust/blob/master/chapter-3/src/main.rs). In this example, starting on ~line 22 (at least as of the time of writing this entry) is the `shadowed` function. There are a couple of times that the `x` variable was shadowed and you can see when it goes out of scope.

At the end of the scope, Rust automagically calls the `drop` function to return the memory. The book explains that this is similar to Resource Acquisition Is Initialization (RAII) in C++.  I took some C++ in school, many moons ago, but I don't recall this.

This will effect how the code is written, though. Programming in a functional programming paradigm seems to me to be the best option for this.  Pass what you need, create only what is OK to have removed, and pass back values to use elsewhere.

A fun side note: 
For simple variables like an int
```
let x = 5;
let y = x;
```
The value 5 is indeed copied into `y`.

For the more complex string
```
let x = String::from("my string");
let y = x;
```
The pointer to the heap is copied, not the value itself. I imagine then, and I'll need to check in my learn-rust repo, that if I were to modify `x`, it would modify the value of `y` since it's just a reference to the same point in memory.

**Follow Up**
Rust takes care of that because it might screw with your memory if you try to `drop` both `x` and `y`. `x` is now considered invalid and doesn't hold the reference anymore. Rust thinking ahead!

**Follow Up 2**
Because of how it invalidates on assignment, 
```
fn main() {
  let s = String::from('something');

  some_function(s);
  ...
}
```
`s` is now invalid after passing it to `some_function`. If you need to continue to use the value of `s`, you should consider returning it from `some_function`.  If you don't need it after `some_function` consider if you need it in `main`. It depends on what `some_function` actually does. 

Really need to consider how my programs are built and designed. Rust will be a good lesson in architecture.

**Yay, more notes**
Unless you pass by reference.
```
fn main() {
  let s = String::from("some string");

  let len = get_length_of_string(&s);

  println!("s is still a valid variable: {s}");
}
```

This passes the reference instead of the pointer, allowing you to keep `s` as a valid reference to use elsewhere in your program.

Sorry for the waffling on some of the above information. That's what happens when you re-read. You learn a little more, and remember a little better.

See you next week!