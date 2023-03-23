---
author: "k"
pubDate: "2023-03-23"
title: "手写一个脚本语言解释器"
tags: ["craftinginterpreters"]
description: ""
---

这次分享的内容来自于一本书，名叫《craftinginterpreters》，直译就是手写解释器。
手写解释器这个主题，听起来是一块硬骨头要啃，设计一门语言并实现它，对于前段时间的我，也是一个百分之百无法完成的任务。但是现在我可以很负责任地告诉你，大家都能做到，因为这本书提供了完整的代码，只需要复制和粘贴就可以了，诸位都是CV大佬，肯定不在话下。我无法把内容全部覆盖到，所以如果有不懂的地方，最好的方式还是实际跑一下这个代码。

## 引入

进入正题之前，我们先做一下相关背景的回顾。

作为程序员平均每天坐在电脑前超过8个小时跟代码打交道，代码如何运行，我们需要去理解它。但是中间太多步骤，每一步都有一些原理或者背景知识，体量之大让我望而却步。趁着这次分享的机会，我们一起来梳理一下。

- 程序员写的代码交给计算机去运行，实际上是交给CPU，因为CPU充当着计算机的大脑
- CPU接收的输入都是二进制数据0和1组成的指令
- 这些二进制数据对于人类来说太难区分，所以我们给每个指令都创造了一个助记符，顾名思义，是帮助人类记忆的符号，现在我们叫它汇编语言，在这个时代，程序员用助记符写代码，然后把助记符转换成机器指令，程序员们把这个过程叫做汇编

```asm
init_registers:
    mov ax, cs
    mov ds, ax
    mov es, ax
    mov ss, ax
    mov fs, ax
    mov sp, 0x7c00
    mov ax, 0xb800
    mov gs, ax
    ret
```

- 助记符是指令的一对一映射，所以面向的还是硬件，对于人类来说只是换了一种表达方式，仍然不能很直接地表达人类的意图，需要再进一步包装，变成人类能理解的词汇，于是就出现了Fortran、PASCAL、BASIC、C这类高级语言，所以我们可以用更简洁直观的语法写代码，要运行的时候，先把我们的代码转换成汇编代码，程序员们把这个过程叫做编译
- 到目前这个阶段，编程语言的工作方式已经基本确定，早期的痛点都得到了完美解决，一切都在往好的方向发展，直到一个之前被忽视的事情渐渐浮出水面，那就是不同的CPU，能识别的指令也不一样，这导致程序员写的代码无法在不同的电脑上运行，如果想要运行，就必须编译成那台电脑的CPU所能识别的指令，随着时代的发展，硬件也在快速地更新换代，这个痛点越发严重，于是编程语言出现了另一种工作方式，叫做解释执行
- 简单概括一下解释执行的工作方式就是：在之前的基础上再包装一层，引入一个角色叫解释器（或虚拟机），解释器负责识别用户代码并把代码翻译成用户的电脑能识别的指令，硬件之间的差异交给解释器去处理，程序员们终于从这些差异中抽身，可以投入全部精力致力于伟大的软件事业，对于这种需要解释执行的语言，程序员将他们分类为脚本语言

回顾结束，整个发展通透且自然，我们今天要聊的，是距离我们最近的这一层，解释器。在我们部门，后端使用最多的python，前端使用最多的java script，都属于解释执行的这一类。

接下来是今天的重点内容，两个主题：

1. 梳理流程
2. 挑几个代表性的实现，读读代码

## Scanner

第一步，扫描源代码，把它分解到最小粒度，得到一个序列。比如这样的代码：

```js
var a = 1;
print a;
print "hello world";
```

我们会分解成这个样子：

```python
var -> 关键字 VAR
空格 -> 略过
a -> 变量
空格 -> 略过
= -> 等号
空格 -> 略过
1 -> 数值-字面量
; -> 分号

换行 -> 略过

print -> 关键字 PRINT
空格 -> 略过
a -> 变量
; -> 分号

换行 -> 略过

print -> 关键字 PRINT
空格 -> 略过
"hello world" -> 字符-字面量

【结束】
```

这些东西有个名字叫 Token，这个词大家并不陌生，但在语义学中通常翻译为符号，是一个相当抽象的解释。（所有字的都是符号，这样想会比较容易理解。）哪些是关键字，哪些是符号，哪些是变量，都要识别出来。我们的实现方式也很简单粗暴，一个字母一个字母地去匹配，我最开始在想，这样写是不是太麻烦了？代码里字母、符号、数字互相排列组合的结果太多了，不太可能全部写出来吧。我们通过代码来看下到底是怎么做的。

首先在记录 Token 时，我们要记录

- Token 的类型
- Token 在源码中的单词
- Token 代表的值
- Token 出现的行数

```java
class Token {
    final TokenType type;
    final String lexeme;
    final Object literal;
    final int line;

    Token(TokenType type, String lexeme, Object literal, int line) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

    public String toString() {
        return type + " " + lexeme + " " + literal;
    }
}
```

第一步，我们把 Token 按照长度和匹配的优先级，分下类：

- 单字符 Token`, . + - * ; ( ) { }`
- 连字符 Token`= == > >= < <= ! != / //`
- 字面量

```python
所有的数值 -> literal
所有的字符串 -> string
其他 -> identifier 标识符（可能和关键字冲突）
```

- 关键字

```python
var fun class
super this
print return
if else for while
and or
true false nil
```

- 最后还需要一个代表代码全部结束的标记，EOF，在我们解析完所有Token之后，补充到最后

分好类之后，我们的逻辑也基本清晰了：

1. 匹配单字符，匹配到了就拿到对应 Token
2. 如果匹配到了连字符，尝试匹配下一个，如果下一个能匹配成功，就是连字符 Token，如果下一个匹配失败，就退化成单字符，比如遇到一个 >，我们看下一个是不是 =
3. 除此之外，我们要匹配双引号，遇到双引号我们认为是在定义字符串，一直往后读，直到遇见下一个双引号
4. 如果以上都不是，那么估计是字母或数字
  4.1. 如果是数字开头，那么我们就尝试读取后续的数字
  4.2. 如果是字母开头，那么我们就尝试读取后面的字母或数字，视为一个变量名
  4.3. 拿到完整变量名之后，我们再进行关键字检测，如果命中，优先视为关键字

如果这些逻辑匹配失败，那么我们就视为代码中有错误。

## Parser

解析完 Token，我们知道了代码都由哪些部分组成，代码中都是合法的字符，下一步我们要检测语法。
首先，该怎么表示语法，举个例子，定义方法时：

```js
fun funName(param1, param2) {
    print param1;
    print param2;
    return 0;
}
```

这几行代码的 Token 会是这样（忽略空格）：

```python
关键字 fun
一个标识符 funName
左括号
标识符 param1
逗号
标识符 param2
右括号
左花括号
关键字 print
标识符 param1
分号
关键字 print
标识符 param2
分号
关键字 return
数值 0
分号
右花括号
```

那么我们可以设计这样一条规则：如果遇到关键字 fun，我们就假设后面的这些 Token 会组成一个函数，这些 Token 按顺序依次是：

- 一个标识符，作为函数名，必须
- 一个左括号，代表开始声明入参，必须
- 一定数量的标识符，以逗号分隔，作为函数的入参声明，非必须，因为函数可以没有入参
- 一个右括号，代表入参声明结束了，必须
- 一个左花括号，代表下面要声明函数体，必须
- 一些【语句】，由分号结尾，非必须，函数里可以是空的
- 一个右花括号，代表函数体结束，必须

如果满足以上逻辑，就成功定义了一个函数
然后我们把这个逻辑，用代码实现出来，定义一个【函数】：

```java
// 定义函数的语句
  static class Function extends Stmt {
    Function(Token name, List<Token> params, List<Stmt> body) {
      this.name = name;  // 记录函数名
      this.params = params;  // 入参的列表
      this.body = body;  // 函数体，一个代码块，也是由一组语句组成
    }
  }
```

在这一步比较核心的是区分 表达式 Expression 和 语句 Statement，因为在读的过程中，我发现在解析语法时，有些东西被作者定义成表达式，有些是语句。有时候我认为某个语法是一条语句，但是作者却把它定义成表达式。经过一些思考和实践之后，我总结了一个区分的方式：如果一行代码，是需要进行运算得到一些值的时候，就属于表达式；如果一行代码是为了定义某个东西或者一个工作流，不产生任何值，属于语句。我们的解释器在遇到表达式的时候，会进行运算得到结果，在遇到语句的时候，会按照语句定义的流程去执行代码，如果执行过程中遇到表达式，也会进行运算。正是一个个表达式，加上一些流程控制，构成了语句。

```java
    public static void main(String[] args) throws IOException {
        if (args.length != 1) {
          System.err.println("Usage: generate_ast <output directory>");
          System.exit(64);
        }
        String outputDir = args[0];
        defineAst(outputDir, "Expr", Arrays.asList(
            "Binary   : Expr left, Token operator, Expr right",
            // Call 的 paren 参数，记录的是函数右括号的 Token，用于报错时指明代码的位置
            "Call     : Expr callee, Token paren, List<Expr> arguments",
            "Get      : Expr object, Token name",
            "Set      : Expr object, Token name, Expr value",
            "Super    : Token keyword, Token method",
            "This     : Token keyword",
            "Grouping : Expr expression",
            "Literal  : Object value",
            "Logical  : Expr left, Token operator, Expr right",
            "Unary    : Token operator, Expr right",
            "Variable : Token name",
            "Assign   : Token name, Expr value"
          ));
        defineAst(outputDir, "Stmt", Arrays.asList(
            "Block      : List<Stmt> statements",
            "Class      : Token name, Expr.Variable superClass, List<Stmt.Function> methods",
            "Expression : Expr expression",
            "Function   : Token name, List<Token> params, List<Stmt> body",
            "If         : Expr condition, Stmt thenBranch, Stmt elseBranch",
            "Print      : Expr expression",
            "Return     : Token keyword, Expr value",
            "Var        : Token name, Expr initializer",
            "While      : Expr condition, Stmt body"
        ));
      }
```

## Interpreter

这部分是整个语言的核心，因为这里是代码实际被执行的地方。
在 parser中 我们已经全面解析了代码，分成了2类：表达式 和 语句。我们只需要一条一条执行就可以了。

```java
class Interpreter implements Expr.Visitor<Object>, Stmt.Visitor<Void> {

    final Environment globals = new Environment();  // globals 全局变量存储区
    private Environment environment = globals;  // environment 当前上下文 初始化为全局
    private final Map<Expr, Integer> locals = new HashMap<>();  // locals 本地上下文 初始化为空

    // 解释器入口方法
    void interpret(List<Stmt> statements) {
        try {
            for (Stmt stmt: statements) {
                execute(stmt);  // stmt 并不是一行 而是一个包含完整语义的代码块
            }
        } catch (RuntimeError error) {
            Jlox.runtimeError(error);
        }
    }
}
```

在执行的过程中，我们需要一个地方存储代码中产生的对象，并且给这些对象一个表示形式，比如：解释器遇到一条函数声明语句，要把函数存下来，以便在后续发生调用的地方，能够找到这个函数，并且执行其中的代码块。
代码中的 globals 和 locals 就是我们存储对象的地方，对象怎么表示呢？

```java
// lox 类型-> Java 类型
// number -> Double
// string -> String
// true -> true
// false -> false
// nil -> null
// func -> JloxFunction extends JloxCallable
// class -> JloxClass extends JloxCallable
interface JloxCallable {
    int arity();  // 入参的数量 对于类来说 就是初始化方法的入参数量
    Object call(Interpreter interpreter, List<Object> arguments);
}
```

那对象什么时候放 globals 什么时候放 locals 呢？
答案是作用域。

```java
class Environment {
    final Environment enclosing;  // 外层作用域
    private final Map<String, Object> values = new HashMap<>();

    Environment() {
        enclosing = null;
    }

    Environment(Environment environment) {
        this.enclosing = environment;
    }

    Object get(Token name) {
        // 读取变量
        if (values.containsKey(name.lexeme)) {
            return values.get(name.lexeme);
        }
        if (enclosing != null) {
            return enclosing.get(name);
        }
        throw new RuntimeError(name, "Get variable fail. Undefined variable '" + name.lexeme + "'.");
    }
}
```

回头看下 Environment 的实现，如果我们调用第二个构造函数，会在创建 env 时指定一个外层作用域。作用域的优先级是由内到外，我们在读取作用域中的对象时，如果当前作用域不存在，再去外层查找。

变量拿到之后，我们开始实现功能，在语义已经十分明确的基础上，这一步水到渠成：
比如我们的输入代码是：

```js
print 123;
```

Scanner 输出的是：

```java
Token token1 = Token(
    type=TokenType.PRINT,
    lexeme="print",
    literal=null,
    line=1,
)

Token token2 = Token(
    type=TokenType.LITERAL,
    lexeme="123",
    literal=123,
    line=1,
)

Token token3 = Token(
    type=TokenType.SEMECOLON,
    lexeme=";",
    literal=null,
    line=1,
)
```

Parser 输出的是：

```java
Stmt.Print stmt = Stmt.Print(expression=Expr.Literal(object=123))
// print 语句包表达式 因为 print 后面不一定是值
解释器要做的就是：
private executePrintStmt(Stmt.Print stmt) {
    Object value = evaluate(stmt.expr);  // 先把要 print 的最终值计算出来
    system.out.println(value.toString());  // 完成输出即可
}
```

## Resolver

这是一个最后引入的组件，但是它其实是在 Interpreter 之前的流程。它的主要作用是在语义层面上，去检测、实现并优化代码，并且可以在进入运行时之前就发现问题。
比如：

```js
print a;
var a = 1;
```

这是两行语法正常的代码，但是它有很明显的语义缺陷，在变量定义之前就先发生了访问。
比如：

```js
class A {
    printA() {
        print this;
    }
}
```

这是一个语法正常、且功能正常的代码，但是这个 this 没有声明过，为什么我们可以访问到它，也是得益于 resolver 在定义类中的方法时，将 this 的语义注入到了当前上下文中。

这一步其实很简单，在每个作用域中，维护一个map，每个对象，分成可用和不可用。
然后通过以下3个操作，就可以检测代码语义：

- declare 声明：当对象第一次出现，将对象放进当前作用域的map，给个初始值 false，代表还不可用
- define 定义：当对象被正常声明，给了值，将map中该对象的值更新为 true，代表已经可用
- resolve 解析：当对象被访问时，如果对象不在当前作用域的map中、也不在外层作用域的map中，或者值为false，就可以抛错
正常情况下，代码中的变量、函数、类都会按照上面这三步去执行，有任意顺序出错都能检测到

## 结尾

1. 有一些概念并没有提出来：比如前中后端，抽象语法树，以及代码中的核心设计观察者模式。
2. 还有一些功能设计思路没有讲解：比如面向对象的继承、实例的初始化、如何处理初始化方法的返回值、super调用父类方法等等，这些内容的不是今天的重点，一门语言可以不支持面向对象，它只是一种编程思想。
3. 这本书有一个亮点是核心流程都是纯手写的，没有依赖其他轮子，主要是为了理解原理，但现代语言的设计有很成熟的标准和软件可以使用，Lex & YACC，我们只需要声明语法规则，具体的解析和构造它们都能完成，并且输出成统一的格式。

我想今天过后，在设计编程语言这个事情上，大家缺的不再是知识和能力，而只是一个革命性的想法。

## 一些链接

书 <https://craftinginterpreters.com/>，往下滑有可以免费在线阅读

源码 <https://github.com/zhangkai803/jlox>

书的中文译本 <https://github.com/GuoYaxiang/craftinginterpreters_zh>
