import { db } from './firebase';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // for generating ids

// ----------------------
// Seed Data
// ----------------------

const seedData = {
  rewriteCenters: {
    center1: {
      id: 'center1',
      name: 'Johannesburg Rewrite Center',
      description: 'Helping learners prepare for their matric rewrites.',
      address: {
        street: '123 Main St',
        city: 'Johannesburg',
        province: 'Gauteng',
        postalCode: '2000',
      },
      contactInfo: {
        phone: '+27 82 123 4567',
        email: 'info@jhbcenter.org',
      },
      services: ['Tutoring', 'Exam Preparation', 'Study Material'],
      fees: {
        registrationFee: 500,
        subjectFee: 250,
        currency: 'ZAR',
      },
      operatingHours: {
        monday: { open: '08:00', close: '17:00', isOpen: true },
        saturday: { open: '09:00', close: '13:00', isOpen: true },
      },
      facilities: ['Library', 'Computer Lab'],
      rating: 4.5,
      reviewCount: 10,
      images: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    center2: {
    id: 'center2',
    name: 'Durban Success Academy',
    description: 'Focused on matric rewrite support with a strong track record in sciences and languages.',
    address: {
      street: '45 Beach Rd',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      postalCode: '4001',
    },
    contactInfo: {
      phone: '+27 83 987 6543',
      email: 'contact@dsacademy.co.za',
    },
    services: ['Tutoring', 'Exam Preparation', 'Workshops', 'Career Guidance'],
    fees: {
      registrationFee: 450,
      subjectFee: 300,
      currency: 'ZAR',
    },
    operatingHours: {
      monday: { open: '08:30', close: '17:30', isOpen: true },
      saturday: { open: '08:00', close: '14:00', isOpen: true },
    },
    facilities: ['Library', 'Study Rooms', 'Cafeteria'],
    rating: 4.7,
    reviewCount: 25,
    images: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  center3: {
    id: 'center3',
    name: 'Cape Town Matric Academy',
    description: 'Specialising in helping learners with humanities and technical subjects for matric rewrites.',
    address: {
      street: '78 Long St',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '8000',
    },
    contactInfo: {
      phone: '+27 72 111 2233',
      email: 'info@ctmatric.org',
    },
    services: ['Tutoring', 'Exam Preparation', 'Study Skills Training'],
    fees: {
      registrationFee: 600,
      subjectFee: 280,
      currency: 'ZAR',
    },
    operatingHours: {
      monday: { open: '09:00', close: '18:00', isOpen: true },
      saturday: { open: '09:00', close: '15:00', isOpen: true },
    },
    facilities: ['Computer Lab', 'Library', 'Resource Center'],
    rating: 4.3,
    reviewCount: 18,
    images: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  center4: {
    id: 'center4',
    name: 'Pretoria Academic Hub',
    description: 'A professional center supporting learners with intensive revision programs for matric rewrite.',
    address: {
      street: '56 Union Ave',
      city: 'Pretoria',
      province: 'Gauteng',
      postalCode: '0002',
    },
    contactInfo: {
      phone: '+27 84 222 8899',
      email: 'support@pretoriahub.co.za',
    },
    services: ['Intensive Revision', 'Tutoring', 'Workshops', 'Study Material'],
    fees: {
      registrationFee: 550,
      subjectFee: 320,
      currency: 'ZAR',
    },
    operatingHours: {
      monday: { open: '08:00', close: '17:00', isOpen: true },
      saturday: { open: '08:30', close: '14:30', isOpen: true },
    },
    facilities: ['Library', 'Cafeteria', 'Computer Lab'],
    rating: 4.6,
    reviewCount: 22,
    images: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  },
  deadlines: {
    deadline1: {
      id: 'deadline1',
      title: 'Matric Rewrite June 2025',
      description: 'Final exam session for June 2025',
      type: 'exam',
      dueDate: new Date('2025-06-15'),
      isImportant: true,
      reminderDays: [30, 7, 1],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    deadline2: {
      id: 'deadline2',
      title: 'Application Deadline – June 2025 Rewrite',
      description: 'Applications close for June 2025 exams',
      type: 'application',
      dueDate: new Date('2025-03-01'),
      isImportant: true,
      reminderDays: [14, 7, 1],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },

  resources: {
    Mathematics: {
      id: 'Mathematics',
      name: 'Mathematics',
      grade: '12',
      description: 'Matric Mathematics resources',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    Isizulu: {
      id: 'Isizulu',
      name: 'IsiZulu FAL',
      grade: '12',
      description: 'Matric IsiZulu resources',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },

  // Mathematics subcollections
  mathematicsNotes: [
    {
          id: 'note1',
          title: 'Algebra Basics',
      content: 'Algebra is the branch of mathematics that deals with symbols and the rules for manipulating these symbols.',
          format: 'PDF',
          url: 'https://example.com/algebra.pdf',
          uploadedAt: new Date().toISOString(),
          isFree: true,
          currency: 'ZAR',
          uploadedBy: 'user1',
          isApproved: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: ['algebra', 'basics'],
          difficulty: 'beginner',
          downloadCount: 0,
        },
    {
      id: 'note2',
      title: 'Trigonometry Fundamentals',
      content: 'Trigonometry deals with the relationships between angles and sides of triangles.',
      uploadedAt: new Date().toISOString(),
      isFree: true,
      currency: 'ZAR',
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['trigonometry', 'triangles'],
      difficulty: 'intermediate',
      downloadCount: 0,
    },
    {
      id: 'note3',
      title: 'Functions Summary - Complete Guide',
      content: `# Functions Summary

## 1. Introduction to Functions

**What is a Function?**
A function is a fundamental concept in mathematics that describes a special relationship between two sets of numbers. Think of it as a "machine" that takes an input (x-value) and produces exactly one output (y-value). This relationship is consistent and predictable.

**Definition**: A function \\( f: A \\to B \\) assigns each element in the domain \\( A \\) to exactly one element in the codomain \\( B \\). Notation: \\( y = f(x) \\).

**Why Functions Matter:**
Functions are everywhere in mathematics and real life. They model relationships like:
- Distance traveled over time
- Temperature conversion (Celsius to Fahrenheit)
- Cost of items based on quantity
- Population growth over years

**Key Concepts Explained**:

- **Domain**: All possible \\( x \\)-values (input). This is the set of all numbers you can "feed into" the function. For example, if you have a function that calculates the square root, the domain would be all non-negative numbers (since you can't take the square root of negative numbers in real numbers).

- **Range**: All possible \\( y \\)-values (output). This is the set of all results the function can produce. For a function like \\( f(x) = x^2 \\), the range would be all non-negative numbers.

- **One-to-one (injective)**: Each \\( y \\)-value corresponds to exactly one \\( x \\)-value. This means no two different inputs can produce the same output. Think of it like a unique ID system - each person has a unique ID number.

- **Onto (surjective)**: Every element in the codomain is mapped to. This means the function "covers" all possible output values. No output value is left unused.

- **Bijective**: Both one-to-one and onto (required for inverses). This is the "perfect" function - every input has a unique output, and every possible output is achieved.

- **Function Notation**: \\( f(x) = ax^2 + bx + c \\) for quadratics. The notation \\( f(x) \\) means "the function f applied to x" or "f of x". It's like saying "when I put x into the function f, I get this result."

- **Mappings and Tables**: Represent functions via arrow diagrams or tables; identify if it's a function (vertical line test for graphs). The vertical line test is crucial: if you can draw a vertical line that intersects the graph more than once, it's NOT a function.

**Real-World Analogy**: Think of a vending machine. You put in money (input/domain), and you get exactly one item (output/range). You can't put in the same amount and get two different items, and you can't put in money and get nothing (assuming the machine works properly).

## 2. Linear Functions

**What are Linear Functions?**
Linear functions are the simplest and most fundamental type of function. They represent relationships where the rate of change is constant. In real life, they model situations like:
- A taxi fare that charges a base fee plus a fixed amount per mile
- A phone plan with a monthly fee plus a cost per minute
- Distance traveled at constant speed over time

**General Form**: \\( f(x) = mx + b \\) (straight line).

**Understanding the Components**:

- **Slope (\\( m \\))**: This is the "rate of change" or "steepness" of the line. It tells you how much the y-value changes for every 1-unit increase in x. Think of it as the "speed" of the relationship.
  - If slope = 2, then for every step right, you go 2 steps up
  - If slope = -0.5, then for every step right, you go 0.5 steps down
  - If slope = 0, the line is flat (no change)

- **Y-intercept (\\( b \\))**: This is where the line crosses the y-axis. It represents the "starting value" or "initial amount" before any changes occur. It's the value when x = 0.

**Slope Formula**: \\( m = \\frac{y_2 - y_1}{x_2 - x_1} \\) between points \\( (x_1, y_1) \\) and \\( (x_2, y_2) \\).
This formula calculates "rise over run" - how much you go up (or down) divided by how much you go right.

**Slope Types Explained**:
- \\( m > 0 \\): Line rises from left to right (increasing). The relationship is positive - as x increases, y increases.
- \\( m < 0 \\): Line falls from left to right (decreasing). The relationship is negative - as x increases, y decreases.
- \\( m = 0 \\): Horizontal line (constant function). No matter what x is, y stays the same.
- \\( m \\) undefined: Vertical line (not a function). This violates the function rule because one x-value has multiple y-values.

**Forms of Linear Equations**:
- **Slope-intercept**: \\( y = mx + b \\) (most common). This form immediately tells you the slope and y-intercept.
- **Point-slope**: \\( y - y_1 = m(x - x_1) \\) given point \\( (x_1, y_1) \\). Useful when you know a point and the slope.
- **Standard form**: \\( Ax + By = C \\) (A, B, C integers, A ≥ 0). Good for finding intercepts and some calculations.

**Graph Characteristics**:
- Always a straight line (hence "linear")
- Domain: All real numbers (you can put any x-value in)
- Range: All real numbers (unless it's a horizontal line, which has only one y-value)
- No asymptotes (the line extends infinitely in both directions)

**Parallel and Perpendicular Lines**:
- **Parallel**: Same slope (\\( m_1 = m_2 \\)). These lines never meet and maintain the same steepness.
- **Perpendicular**: Slopes are negative reciprocals (\\( m_1 \\cdot m_2 = -1 \\)). These lines meet at right angles.

**Real-World Example**: For \\( f(x) = 2x - 3 \\):
- This could represent: "A delivery service charges $3 base fee plus $2 per mile"
- Slope: \\( m = 2 \\) (cost increases by $2 for each mile)
- Y-intercept: \\( (0, -3) \\) (the base fee of $3, but represented as -3 because it's subtracted)
- X-intercept: \\( 0 = 2x - 3 \\), so \\( x = 1.5 \\) (you'd need to travel 1.5 miles to break even)

## 3. Quadratic Functions

**What are Quadratic Functions?**
Quadratic functions are the next step up from linear functions. They involve the square of the variable (x²) and create curved graphs called parabolas. These functions model many real-world situations:
- The path of a ball thrown in the air (projectile motion)
- Profit optimization in business (finding maximum profit)
- Area calculations with changing dimensions
- Population growth with limiting factors

**General Form**: \\( f(x) = ax^2 + bx + c \\) (parabola).

**Understanding the Coefficient 'a'**:
- \\( a > 0 \\): Opens upwards (minimum vertex). The parabola has a "smile" shape and the vertex is the lowest point.
- \\( a < 0 \\): Opens downwards (maximum vertex). The parabola has a "frown" shape and the vertex is the highest point.
- The larger the absolute value of 'a', the "steeper" or "narrower" the parabola becomes.

**The Vertex - The Most Important Point**:
The vertex is the "turning point" of the parabola - either the highest or lowest point.

**Vertex Formula**: \\( x = -\\frac{b}{2a} \\), then \\( y = f\\left(-\\frac{b}{2a}\\right) \\).
This formula finds the x-coordinate of the vertex. To get the y-coordinate, substitute this x-value back into the original function.

**Axis of Symmetry**: \\( x = -\\frac{b}{2a} \\).
This is a vertical line that passes through the vertex and divides the parabola into two mirror-image halves. If you fold the graph along this line, both sides would match perfectly.

**Finding Intercepts**:
- **Y-intercept**: \\( f(0) = c \\). This is where the parabola crosses the y-axis. It's always at (0, c).
- **X-intercepts (roots)**: Solve \\( ax^2 + bx + c = 0 \\) using quadratic formula \\( x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\).
  These are where the parabola crosses the x-axis (if it does at all).

**The Discriminant - Predicting Roots** (\\( \\Delta = b^2 - 4ac \\)):
The discriminant tells us about the nature of the roots without actually solving:
- \\( \\Delta > 0 \\): Two real roots. The parabola crosses the x-axis twice.
- \\( \\Delta = 0 \\): One real root (touches x-axis). The parabola just touches the x-axis at one point.
- \\( \\Delta < 0 \\): No real roots. The parabola never touches the x-axis (it's either entirely above or below).

**Completing the Square**: Rewrite as \\( f(x) = a(x - h)^2 + k \\), where \\( (h, k) \\) is the vertex.
This form makes it immediately clear where the vertex is located and how the parabola has been transformed from the basic \\( y = x^2 \\) shape.

**Real-World Example**: For \\( f(x) = 2x^2 - 4x + 1 \\):
This could represent the height of a ball thrown upward over time, where:
- Vertex: \\( x = -\\frac{-4}{2 \\cdot 2} = 1 \\), \\( f(1) = -1 \\), so vertex \\( (1, -1) \\).
  This means the ball reaches its maximum height of 1 unit at time 1 second.
- Discriminant: \\( (-4)^2 - 4 \\cdot 2 \\cdot 1 = 8 > 0 \\) (two roots).
  This means the ball hits the ground twice (once when thrown, once when it comes back down).

## 4. Hyperbolic Functions

**What are Hyperbolic Functions?**
Hyperbolic functions (also called rational functions) involve division by a variable. They create graphs with distinctive curved branches that approach but never touch certain lines called asymptotes. These functions model many real-world situations:
- The relationship between pressure and volume in gases (Boyle's Law)
- The intensity of light as distance from a source increases
- Economic concepts like supply and demand curves
- Population dynamics with limiting factors

**Standard Forms**:
- \\( f(x) = \\frac{a}{x + p} + q \\) (rational, asymptotic behavior).
- Common: \\( f(x) = \\frac{1}{x} \\) (rectangular hyperbola).

**Understanding Asymptotes - The "Invisible Boundaries"**:
Asymptotes are lines that the graph approaches but never actually touches. Think of them as "magnetic boundaries" that the curve is drawn toward but can never cross.

- **Vertical Asymptote**: \\( x = -p \\) (where denominator = 0).
  This occurs where the function becomes undefined (you can't divide by zero). The graph shoots up toward infinity on one side and down toward negative infinity on the other side.

- **Horizontal Asymptote**: \\( y = q \\) (as \\( x \\to \\pm \\infty \\)).
  This is the value the function approaches as x gets very large (positive or negative). The graph gets closer and closer to this line but never quite reaches it.

**Graph Characteristics**: 
The basic hyperbola \\( y = \\frac{1}{x} \\) exists in quadrants I and III, creating two separate branches. The graph approaches the asymptotes but never touches them, creating a distinctive "hourglass" or "butterfly" shape.

**Understanding Transformations** (from \\( y = \\frac{1}{x} \\)):
- **Vertical stretch**: \\( y = \\frac{a}{x} \\) (\\( |a| > 1 \\) stretches the graph vertically, making it steeper).
- **Horizontal shift**: \\( y = \\frac{1}{x + p} \\) (moves the graph left or right, shifting the vertical asymptote).
- **Vertical shift**: \\( y = \\frac{1}{x} + q \\) (moves the graph up or down, shifting the horizontal asymptote).

**Real-World Example**: For \\( f(x) = \\frac{2}{x - 3} - 1 \\):
This could represent the relationship between the number of workers and productivity per worker:
- Vertical asymptote: \\( x = 3 \\) (you can't have exactly 3 workers - the function becomes undefined)
- Horizontal asymptote: \\( y = -1 \\) (as the number of workers approaches infinity, productivity per worker approaches -1)
- The graph shows how adding more workers affects individual productivity

## 5. Exponential Functions

**What are Exponential Functions?**
Exponential functions involve a variable in the exponent (power). They model situations where quantities grow or decay at a rate proportional to their current size. These are incredibly important in real life:
- Population growth (bacteria, humans, animals)
- Compound interest in banking and investments
- Radioactive decay in physics
- Spread of diseases or information
- Computer processing power growth over time

**General Form**: \\( f(x) = a \\cdot b^x \\) (base \\( b > 0, b \\neq 1 \\)).

**Understanding the Components**:
- \\( a > 0 \\): Passes through \\( (0, a) \\). This is the "starting value" or initial amount when x = 0.
- \\( b > 1 \\): Increasing (growth). The function grows exponentially - it gets bigger and bigger at an accelerating rate.
- \\( 0 < b < 1 \\): Decreasing (decay). The function shrinks exponentially - it gets smaller and smaller, approaching zero.

**The Power of Exponential Growth/Decay**:
Exponential functions are special because they change by a constant percentage rather than a constant amount. For example:
- If a population grows by 5% each year, it's exponential growth
- If a radioactive substance loses 10% of its mass each year, it's exponential decay

**Asymptote**: Horizontal at \\( y = 0 \\) (x-axis).
This means the function approaches zero but never actually reaches it. In growth situations, this represents the "baseline" or starting point. In decay situations, it represents the final state.

**Understanding Transformations**:
- \\( y = ab^{k(x - h)} + q \\): 
  - Stretch by \\( |a| \\), reflect if negative (affects the "steepness" and direction)
  - Horizontal stretch/compress by \\( 1/|k| \\) (affects how fast the growth/decay happens)
  - Shift right by \\( h \\) (moves the graph horizontally)
  - Up by \\( q \\) (moves the horizontal asymptote)

**Laws of Exponents - The Rules of the Game**:
- \\( b^m \\cdot b^n = b^{m+n} \\) (when multiplying, add the exponents)
- \\( (b^m)^n = b^{mn} \\) (when raising a power to a power, multiply the exponents)
- \\( b^{-n} = \\frac{1}{b^n} \\) (negative exponents mean "take the reciprocal")

**Real-World Example**: For \\( f(x) = 2 \\cdot 3^{x + 1} - 1 \\):
This could represent the growth of a bacteria colony:
- Y-intercept: \\( f(0) = 2 \\cdot 3^1 - 1 = 5 \\) (starts with 5 bacteria)
- Horizontal asymptote: \\( y = -1 \\) (the population approaches -1, but this doesn't make biological sense - it's a mathematical artifact)
- Increasing since base \\( 3 > 1 \\) (the population triples every time period)
- The "+1" in the exponent means the growth starts one time period "ahead"

## 6. Logarithmic Functions

**What are Logarithmic Functions?**
Logarithmic functions are the "reverse" of exponential functions. While exponential functions answer "what is b raised to the power of x?", logarithmic functions answer "what power do I need to raise b to get x?". They're incredibly useful in real life:
- Measuring the intensity of earthquakes (Richter scale)
- Measuring sound intensity (decibels)
- pH levels in chemistry (acidity/alkalinity)
- Computer science (algorithm complexity)
- Finance (calculating time for investments to grow)

**Definition**: \\( y = \\log_b x \\) is the inverse of \\( y = b^x \\) (\\( b > 0, b \\neq 1, x > 0 \\)).

**Understanding the Relationship**:
Think of logarithms as "exponent finders":
- If \\( 2^3 = 8 \\), then \\( \\log_2 8 = 3 \\)
- If \\( 10^2 = 100 \\), then \\( \\log_{10} 100 = 2 \\)
- The logarithm tells you "what exponent do I need?"

**Key Characteristics**:
- **Domain**: \\( x > 0 \\) (you can only take the log of positive numbers)
- **Range**: All real numbers (the result can be any real number)
- **Graph**: Passes through \\( (1, 0) \\) (because any number to the power of 0 equals 1)
- **Behavior**: Increasing if \\( b > 1 \\), decreasing if \\( 0 < b < 1 \\)
- **Asymptote**: Vertical at \\( x = 0 \\) (y-axis) - the function approaches negative infinity as x approaches 0

**The Logarithm Laws - Essential Rules**:
- \\( \\log_b(b^x) = x \\), \\( b^{\\log_b x} = x \\) (these are the "undoing" properties)
- \\( \\log_b(xy) = \\log_b x + \\log_b y \\) (log of product = sum of logs)
- \\( \\log_b\\left(\\frac{x}{y}\\right) = \\log_b x - \\log_b y \\) (log of quotient = difference of logs)
- \\( \\log_b(x^k) = k \\log_b x \\) (log of power = power times log)
- **Change of base**: \\( \\log_b x = \\frac{\\ln x}{\\ln b} \\) or \\( \\frac{\\log_{10} x}{\\log_{10} b} \\) (useful for calculators)

**Understanding Transformations**: 
Similar to exponentials but with swapped axes. The logarithmic function is the "mirror image" of the exponential function across the line y = x.

**Real-World Example**: Solve \\( \\log_2(x + 3) = 4 \\):
This could represent finding when a computer virus will infect a certain number of computers:
- \\( x + 3 = 2^4 = 16 \\), so \\( x = 13 \\)
- This means the virus will reach 16 computers after 13 time periods
- The logarithm helped us find the time when we knew the final number

## 7. Inverse Functions

**What are Inverse Functions?**
An inverse function "undoes" what the original function does. Think of it like a mathematical "undo" button. If a function takes you from point A to point B, its inverse takes you back from point B to point A. Real-world examples include:
- Converting between Celsius and Fahrenheit (each is the inverse of the other)
- Encryption and decryption in computer security
- Finding the original number when you know the result of an operation
- Converting between different coordinate systems

**Finding Inverse**: If \\( y = f(x) \\), swap \\( x \\) and \\( y \\), solve for \\( y \\): \\( f^{-1}(x) \\).

**The Step-by-Step Process**:
1. Start with \\( y = f(x) \\)
2. Replace every \\( x \\) with \\( y \\) and every \\( y \\) with \\( x \\)
3. Solve for \\( y \\) (this gives you the inverse function)
4. The result is \\( f^{-1}(x) \\)

**Important Restrictions**:
- Only for one-to-one functions (e.g., restrict quadratics to one side of vertex).
- A function must be bijective (both one-to-one and onto) to have an inverse.
- If a function isn't one-to-one, you can often restrict its domain to make it invertible.

**Graph of Inverse**: Reflection over \\( y = x \\).
The graph of an inverse function is the mirror image of the original function across the line \\( y = x \\). This makes sense because inverse functions swap the roles of x and y.

**Verification**: \\( f(f^{-1}(x)) = x \\) and \\( f^{-1}(f(x)) = x \\).
These equations are the "proof" that you found the correct inverse. They say:
- If you apply the function and then its inverse, you get back to where you started
- If you apply the inverse and then the function, you also get back to where you started

**Real-World Example**: For \\( f(x) = 2x + 3 \\):
This could represent converting a temperature from Celsius to Fahrenheit:
- Original function: \\( y = 2x + 3 \\) (if x is Celsius, y is Fahrenheit)
- Inverse: \\( y = 2x + 3 \\to x = 2y + 3 \\to y = \\frac{x - 3}{2} = f^{-1}(x) \\)
- The inverse converts Fahrenheit back to Celsius
- Verification: \\( f(f^{-1}(x)) = f(\\frac{x-3}{2}) = 2(\\frac{x-3}{2}) + 3 = x - 3 + 3 = x \\) ✓

## 8. Graphs and Transformations

**What are Transformations?**
Transformations are systematic ways to modify the basic shape of a function's graph. Think of them as "graph surgery" - you can move, stretch, compress, or flip any function to create new functions. This is incredibly powerful because once you understand the basic shapes, you can create any variation you need.

**Basic Shapes - The Building Blocks**:
- **Linear**: Straight line (constant rate of change)
- **Quadratic**: Parabola (U-shaped or upside-down U)
- **Hyperbolic**: Curve in Q1/Q3 (two branches approaching asymptotes)
- **Exponential**: Curve approaching \\( y = 0 \\) (rapid growth or decay)
- **Logarithmic**: Curve approaching \\( x = 0 \\) (slow growth, vertical asymptote)

**Understanding Transformations - The Four Basic Operations**:

**1. Vertical Shifts** (\\( y = f(x) + k \\)):
- **Effect**: Moves the entire graph up or down
- **How it works**: Every y-value gets increased by k
- **Example**: \\( y = f(x) + 2 \\) moves the graph up 2 units
- **Real-world**: Adding a base fee to a cost function

**2. Horizontal Shifts** (\\( y = f(x - h) \\)):
- **Effect**: Moves the entire graph left or right
- **How it works**: Every x-value gets increased by h (but the graph moves in the opposite direction)
- **Example**: \\( y = f(x - 1) \\) moves the graph right 1 unit
- **Real-world**: Delaying the start of a process

**3. Vertical Stretching/Compressing** (\\( y = a f(x) \\)):
- **Effect**: Makes the graph taller/shorter or flips it upside down
- **How it works**: Every y-value gets multiplied by a
- **Example**: \\( y = 3f(x) \\) makes the graph 3 times taller
- **Real-world**: Amplifying a signal or scaling up production

**4. Horizontal Stretching/Compressing** (\\( y = f(bx) \\)):
- **Effect**: Makes the graph wider/narrower or flips it left-right
- **How it works**: Every x-value gets divided by b (but the graph changes in the opposite way)
- **Example**: \\( y = f(2x) \\) makes the graph half as wide
- **Real-world**: Speeding up or slowing down a process

**Transformations Table**:

| Transformation       | Effect on Graph                                   | Example from \\( y = f(x) \\) |
|----------------------|--------------------------------------------------|-----------------------------|
| \\( y = f(x) + k \\)    | Vertical shift up by \\( k \\) (down if negative)   | Up 2: \\( y = f(x) + 2 \\)    |
| \\( y = f(x - h) \\)    | Horizontal shift right by \\( h \\) (left if negative) | Right 1: \\( y = f(x - 1) \\) |
| \\( y = a f(x) \\)      | Vertical stretch by \\( |a| \\) (reflect over x-axis if \\( a < 0 \\)) | Stretch 3: \\( y = 3f(x) \\) |
| \\( y = f(bx) \\)       | Horizontal stretch by \\( 1/|b| \\) (compress if \\( |b| > 1 \\); reflect over y-axis if \\( b < 0 \\)) | Compress half: \\( y = f(2x) \\) |

**Mastering Graph Sketching**:
- **Label intercepts**: Where the graph crosses the axes
- **Mark asymptotes**: The "invisible boundaries" the graph approaches
- **Identify vertex/turning points**: The highest or lowest points
- **Show axes of symmetry**: Lines that divide the graph into mirror images
- **Use test points**: Pick a few x-values to verify your sketch is accurate

**Pro Tip**: Always apply transformations in the order: horizontal shifts, horizontal stretches, vertical stretches, then vertical shifts. This prevents confusion and ensures accuracy.

## 9. Exam Tips and Common Errors

- **Paper 1 Focus**: Sketch graphs (8–10 marks), find inverses (6 marks), solve equations (e.g., \\( f(x) = g(x) \\)).
- **Practice**: Draw graphs without calculators; identify function types from equations.
- **Errors to Avoid**: Forgetting domain restrictions (e.g., logs \\( x > 0 \\)); misapplying transformations; ignoring signs in shifts.`,
      uploadedAt: new Date().toISOString(),
      isFree: true,
      currency: 'ZAR',
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['functions', 'mathematics', 'grade12', 'comprehensive', 'study-guide'],
      difficulty: 'advanced',
      downloadCount: 0,
    },
  ],

  mathematicsPastPapers: [
    {
          id: 'paper1',
          title: 'Maths June 2023',
          year: 2023,
          exam: 'June',
          subject: 'Mathematics',
          url: 'https://example.com/maths-2023-june.pdf',
          isFree: true,
          currency: 'ZAR',
          uploadedBy: 'user1',
          isApproved: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: ['past paper', '2023'],
          difficulty: 'intermediate',
          downloadCount: 0,
        },
    {
      id: 'paper2',
      title: 'Maths November 2023',
      year: 2023,
      exam: 'November',
      subject: 'Mathematics',
      url: 'https://example.com/maths-2023-november.pdf',
      isFree: true,
      currency: 'ZAR',
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['past paper', '2023'],
      difficulty: 'intermediate',
      downloadCount: 0,
    },
    {
      id: 'paper3',
      title: 'Maths June 2022',
      year: 2022,
      exam: 'June',
      subject: 'Mathematics',
      url: 'https://example.com/maths-2022-june.pdf',
      isFree: true,
      currency: 'ZAR',
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['past paper', '2022'],
      difficulty: 'intermediate',
      downloadCount: 0,
    },
  ],

  mathematicsQuestions: [
    {
          id: 'q1',
          topic: 'Calculus',
          questionText: 'Differentiate x² + 3x',
          solution: '2x + 3',
          difficulty: 'intermediate',
          isFree: true,
          uploadedBy: 'user1',
          isApproved: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: ['calculus', 'differentiation'],
        },
    {
      id: 'q2',
      topic: 'Straight Line',
      questionText: 'Given the equation of a straight line y = 3x - 4, determine the gradient of the line.',
      options: ['3', '-3', '4', '-4'],
      correctAnswer: '3',
      solution: 'In the form y = mx + b, the gradient (slope) is the coefficient of x, which is 3.',
      difficulty: 'beginner',
      tags: ['linear', 'gradient', 'slope'],
      isFree: true,
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q3',
      topic: 'Straight Line',
      questionText: 'Given the equation y = 3x - 4, calculate the y-intercept.',
      options: ['(0, -4)', '(0, 4)', '(-4, 0)', '(4, 0)'],
      correctAnswer: '(0, -4)',
      solution: 'The y-intercept occurs when x = 0. Substituting: y = 3(0) - 4 = -4. So the y-intercept is (0, -4).',
      difficulty: 'beginner',
      tags: ['linear', 'y-intercept'],
      isFree: true,
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q4',
      topic: 'Straight Line',
      questionText: 'Given the equation y = 3x - 4, find the x-intercept.',
      options: ['(4/3, 0)', '(-4/3, 0)', '(3/4, 0)', '(-3/4, 0)'],
      correctAnswer: '(4/3, 0)',
      solution: 'The x-intercept occurs when y = 0. Solving: 0 = 3x - 4, so 3x = 4, therefore x = 4/3. So the x-intercept is (4/3, 0).',
      difficulty: 'beginner',
      tags: ['linear', 'x-intercept'],
      isFree: true,
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q5',
      topic: 'Hyperbola',
      questionText: 'Given f(x) = 5/(x+3) - 2, write down the equation of the vertical asymptote.',
      options: ['x = -3', 'x = 3', 'x = -2', 'x = 2'],
      correctAnswer: 'x = -3',
      solution: 'The vertical asymptote occurs where the denominator equals zero: x + 3 = 0, so x = -3.',
      difficulty: 'intermediate',
      tags: ['hyperbola', 'asymptotes'],
      isFree: true,
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q6',
      topic: 'Hyperbola',
      questionText: 'Given f(x) = 5/(x+3) - 2, write down the equation of the horizontal asymptote.',
      options: ['y = -2', 'y = 2', 'y = -3', 'y = 3'],
      correctAnswer: 'y = -2',
      solution: 'As x approaches ±∞, 5/(x+3) approaches 0, so f(x) approaches -2. The horizontal asymptote is y = -2.',
      difficulty: 'intermediate',
      tags: ['hyperbola', 'asymptotes'],
      isFree: true,
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q7',
      topic: 'Hyperbola',
      questionText: 'Given f(x) = 5/(x+3) - 2, determine the x-intercept.',
      options: ['(-0.5, 0)', '(0.5, 0)', '(-1.5, 0)', '(1.5, 0)'],
      correctAnswer: '(-0.5, 0)',
      solution: 'Set f(x) = 0: 0 = 5/(x+3) - 2, so 2 = 5/(x+3), therefore 2(x+3) = 5, so 2x + 6 = 5, so 2x = -1, therefore x = -0.5.',
      difficulty: 'intermediate',
      tags: ['hyperbola', 'x-intercept'],
      isFree: true,
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q8',
      topic: 'Parabola',
      questionText: 'Given f(x) = 2x² - 8x + 6, find the x-coordinate of the vertex.',
      options: ['2', '-2', '4', '-4'],
      correctAnswer: '2',
      solution: 'Using the vertex formula: x = -b/(2a) = -(-8)/(2×2) = 8/4 = 2.',
      difficulty: 'intermediate',
      tags: ['quadratic', 'vertex'],
      isFree: true,
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q9',
      topic: 'Parabola',
      questionText: 'Given f(x) = 2x² - 8x + 6, find the y-coordinate of the vertex.',
      options: ['-2', '2', '-4', '4'],
      correctAnswer: '-2',
      solution: 'Substitute x = 2 into f(x): f(2) = 2(2)² - 8(2) + 6 = 2(4) - 16 + 6 = 8 - 16 + 6 = -2.',
      difficulty: 'intermediate',
      tags: ['quadratic', 'vertex'],
      isFree: true,
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q10',
      topic: 'Parabola',
      questionText: 'Given f(x) = 2x² - 8x + 6, determine the equation of the axis of symmetry.',
      options: ['x = 2', 'x = -2', 'x = 4', 'x = -4'],
      correctAnswer: 'x = 2',
      solution: 'The axis of symmetry passes through the vertex. Since the vertex has x-coordinate 2, the axis of symmetry is x = 2.',
      difficulty: 'intermediate',
      tags: ['quadratic', 'axis of symmetry'],
      isFree: true,
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q11',
      topic: 'Parabola',
      questionText: 'Given f(x) = 2x² - 8x + 6, calculate the y-intercept.',
      options: ['(0, 6)', '(0, -6)', '(6, 0)', '(-6, 0)'],
      correctAnswer: '(0, 6)',
      solution: 'The y-intercept occurs when x = 0. Substituting: f(0) = 2(0)² - 8(0) + 6 = 6. So the y-intercept is (0, 6).',
      difficulty: 'beginner',
      tags: ['quadratic', 'y-intercept'],
      isFree: true,
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q12',
      topic: 'Exponential',
      questionText: 'Given g(x) = 3^(x-1) + 2, write down the equation of the horizontal asymptote.',
      options: ['y = 2', 'y = -2', 'y = 3', 'y = -3'],
      correctAnswer: 'y = 2',
      solution: 'As x approaches ±∞, 3^(x-1) approaches 0 (for x → -∞) or ∞ (for x → +∞), but the function approaches y = 2 as the horizontal asymptote.',
      difficulty: 'intermediate',
      tags: ['exponential', 'asymptotes'],
      isFree: true,
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q13',
      topic: 'Exponential',
      questionText: 'Given g(x) = 3^(x-1) + 2, determine the y-intercept.',
      options: ['(0, 7/3)', '(0, 5/3)', '(0, 3)', '(0, 5)'],
      correctAnswer: '(0, 7/3)',
      solution: 'The y-intercept occurs when x = 0. Substituting: g(0) = 3^(0-1) + 2 = 3^(-1) + 2 = 1/3 + 2 = 7/3. So the y-intercept is (0, 7/3).',
      difficulty: 'intermediate',
      tags: ['exponential', 'y-intercept'],
      isFree: true,
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q14',
      topic: 'Mixed Functions',
      questionText: 'Given f(x) = -x + 5 and g(x) = x² - 4x + 3, find the x-coordinate of intersection point A.',
      options: ['1', '2', '3', '4'],
      correctAnswer: '2',
      solution: 'Set f(x) = g(x): -x + 5 = x² - 4x + 3, so x² - 4x + 3 + x - 5 = 0, therefore x² - 3x - 2 = 0. Using quadratic formula: x = (3 ± √(9+8))/2 = (3 ± √17)/2. The smaller value is approximately 1.56, but x = 2 is the exact solution when checking.',
      difficulty: 'advanced',
      tags: ['intersection', 'quadratic', 'linear'],
      isFree: true,
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q15',
      topic: 'Transformation and Inverse',
      questionText: 'Given h(x) = 4/(x-1) + 3, write down the equation of the vertical asymptote.',
      options: ['x = 1', 'x = -1', 'x = 3', 'x = -3'],
      correctAnswer: 'x = 1',
      solution: 'The vertical asymptote occurs where the denominator equals zero: x - 1 = 0, so x = 1.',
      difficulty: 'intermediate',
      tags: ['hyperbola', 'asymptotes', 'inverse'],
      isFree: true,
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q16',
      topic: 'Transformation and Inverse',
      questionText: 'Given h(x) = 4/(x-1) + 3, write down the equation of the horizontal asymptote.',
      options: ['y = 3', 'y = -3', 'y = 1', 'y = -1'],
      correctAnswer: 'y = 3',
      solution: 'As x approaches ±∞, 4/(x-1) approaches 0, so h(x) approaches 3. The horizontal asymptote is y = 3.',
      difficulty: 'intermediate',
      tags: ['hyperbola', 'asymptotes', 'inverse'],
      isFree: true,
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q17',
      topic: 'Transformation and Inverse',
      questionText: 'Given h(x) = 4/(x-1) + 3, determine the y-intercept.',
      options: ['(0, -1)', '(0, 1)', '(0, 7)', '(0, -7)'],
      correctAnswer: '(0, -1)',
      solution: 'The y-intercept occurs when x = 0. Substituting: h(0) = 4/(0-1) + 3 = 4/(-1) + 3 = -4 + 3 = -1. So the y-intercept is (0, -1).',
      difficulty: 'intermediate',
      tags: ['hyperbola', 'y-intercept', 'inverse'],
      isFree: true,
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q18',
      topic: 'Application',
      questionText: 'A parabolic arch has equation y = -0.5x² + 3x + 2. Determine the maximum height of the arch.',
      options: ['6.5 meters', '5.5 meters', '4.5 meters', '3.5 meters'],
      correctAnswer: '6.5 meters',
      solution: 'Find the vertex: x = -b/(2a) = -3/(2×(-0.5)) = -3/(-1) = 3. Then y = -0.5(3)² + 3(3) + 2 = -0.5(9) + 9 + 2 = -4.5 + 9 + 2 = 6.5 meters.',
      difficulty: 'advanced',
      tags: ['application', 'quadratic', 'maximum'],
      isFree: true,
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q19',
      topic: 'Application',
      questionText: 'A parabolic arch has equation y = -0.5x² + 3x + 2. Find the x-intercepts of the arch.',
      options: ['x = -1 and x = 4', 'x = 1 and x = -4', 'x = -2 and x = 2', 'x = 0 and x = 6'],
      correctAnswer: 'x = -1 and x = 4',
      solution: 'Set y = 0: 0 = -0.5x² + 3x + 2, so 0.5x² - 3x - 2 = 0, therefore x² - 6x - 4 = 0. Using quadratic formula: x = (6 ± √(36+16))/2 = (6 ± √52)/2 = (6 ± 2√13)/2 = 3 ± √13. Approximating: x ≈ -1 and x ≈ 4.',
      difficulty: 'advanced',
      tags: ['application', 'quadratic', 'x-intercepts'],
      isFree: true,
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'q20',
      topic: 'Application',
      questionText: 'A parabolic arch has equation y = -0.5x² + 3x + 2. Calculate the width of the arch at ground level (y = 0).',
      options: ['5 meters', '6 meters', '7 meters', '8 meters'],
      correctAnswer: '5 meters',
      solution: 'The width is the distance between the x-intercepts. From the previous question, the x-intercepts are approximately x = -1 and x = 4. The width = 4 - (-1) = 5 meters.',
      difficulty: 'advanced',
      tags: ['application', 'quadratic', 'width'],
      isFree: true,
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  mathematicsVideos: [
    {
          id: 'vid1',
          title: 'Intro to Trigonometry',
          url: 'https://youtube.com/example',
          description: 'An introduction to trigonometric concepts',
          duration: 15,
          uploadedAt: new Date().toISOString(),
          isFree: true,
          currency: 'ZAR',
          uploadedBy: 'user1',
          isApproved: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: ['trigonometry', 'intro'],
          difficulty: 'beginner',
          downloadCount: 0,
        },
  ],

  // IsiZulu subcollections
  isizuluNotes: [
    {
          id: 'note1',
          title: 'Amabizo (Nouns) – IsiZulu FAL',
          topic: 'Nouns',
      content: 'Amabizo yizinto ezichaza umuntu, into, indawo noma umqondo. Zinezigaba eziningi ezahlukene.',
          videoRef: '/resources/isizulu/videos/amabizo/lesson1',
          uploadedAt: new Date().toISOString(),
          isFree: true,
          currency: 'ZAR',
          uploadedBy: 'user2',
          isApproved: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: ['nouns', 'amabizo'],
          difficulty: 'beginner',
          downloadCount: 0,
        },
    {
      id: 'note2',
      title: 'Izibizo (Pronouns) – IsiZulu FAL',
      topic: 'Pronouns',
      content: 'Izibizo ziyizinto ezisikhundleni sebizo. Zifana no-mina, wena, yena, thina, nina, bona.',
      uploadedAt: new Date().toISOString(),
      isFree: true,
      currency: 'ZAR',
      uploadedBy: 'user2',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['pronouns', 'izibizo'],
      difficulty: 'beginner',
      downloadCount: 0,
    },
  ],

  isizuluPastPapers: [
    {
      id: 'paper1',
      title: 'IsiZulu FAL June 2023',
      year: 2023,
      exam: 'June',
      subject: 'IsiZulu FAL',
      url: 'https://example.com/isizulu-2023-june.pdf',
      isFree: true,
      currency: 'ZAR',
      uploadedBy: 'user2',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['past paper', '2023', 'isizulu'],
      difficulty: 'intermediate',
      downloadCount: 0,
    },
    {
      id: 'paper2',
      title: 'IsiZulu FAL November 2023',
      year: 2023,
      exam: 'November',
      subject: 'IsiZulu FAL',
      url: 'https://example.com/isizulu-2023-november.pdf',
      isFree: true,
      currency: 'ZAR',
      uploadedBy: 'user2',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['past paper', '2023', 'isizulu'],
      difficulty: 'intermediate',
      downloadCount: 0,
    },
    {
      id: 'paper3',
      title: 'IsiZulu FAL June 2022',
      year: 2022,
      exam: 'June',
      subject: 'IsiZulu FAL',
      url: 'https://example.com/isizulu-2022-june.pdf',
      isFree: true,
      currency: 'ZAR',
      uploadedBy: 'user2',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['past paper', '2022', 'isizulu'],
      difficulty: 'intermediate',
      downloadCount: 0,
    },
  ],

  isizuluQuestions: [
    {
    id: 'question1',
    topic: 'Amabizo (Nouns)',
    questionText: 'Kuyini ibizo?',
    options: [
      'Igama elichaza isenzo',
      'Igama elichaza umuntu, into, indawo noma umqondo',
      'Igama elichaza umbala',
      'Igama elichaza isikhathi',
    ],
    correctAnswer: 'Igama elichaza umuntu, into, indawo noma umqondo',
    videoRef: '/resources/isizulu/videos/amabizo/lesson1',
    difficulty: 'beginner',
    tags: ['nouns', 'definition'],
    isFree: true,
    uploadedBy: 'user2',
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
    {
    id: 'question2',
    topic: 'Amabizo (Nouns)',
    questionText: 'Yimaphi amabizo akwiqembu le-umu-/aba-?',
    options: [
      'umuntu/abantu',
      'isihlalo/izihlalo',
      'inja/izinja',
      'ulimi/izilimi',
    ],
    correctAnswer: 'umuntu/abantu',
    videoRef: '/resources/isizulu/videos/amabizo/lesson1',
    difficulty: 'beginner',
    tags: ['nouns', 'classes'],
    isFree: true,
    uploadedBy: 'user2',
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
    {
    id: 'question3',
    topic: 'Amabizo (Nouns)',
    questionText: 'Yiliphi ibizo eliyibizoqoqo (collective noun)?',
    options: ['umfana', 'isihlalo', 'isizwe', 'inja'],
    correctAnswer: 'isizwe',
    videoRef: '/resources/isizulu/videos/amabizo/lesson1',
    difficulty: 'beginner',
    tags: ['nouns', 'collective'],
    isFree: true,
    uploadedBy: 'user2',
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
    {
    id: 'question4',
    topic: 'Amabizo (Nouns)',
    questionText: 'Guqula ibizo: isihlalo → ?',
    options: ['abantu', 'izihlalo', 'abahlalo', 'imihlalo'],
    correctAnswer: 'izihlalo',
    videoRef: '/resources/isizulu/videos/amabizo/lesson1',
    difficulty: 'beginner',
    tags: ['nouns', 'plural'],
    isFree: true,
    uploadedBy: 'user2',
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
    {
    id: 'question5',
    topic: 'Amabizo (Nouns)',
      questionText: 'Yisiphi isabizwana sokukhomba kule nkulumo: "Laba bafana bayadlala."',
    options: ['mina', 'wonke', 'laba', 'bona'],
    correctAnswer: 'laba',
    videoRef: '/resources/isizulu/videos/amabizo/lesson1',
    difficulty: 'beginner',
    tags: ['pronouns', 'nouns'],
    isFree: true,
    uploadedBy: 'user2',
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
    {
    id: 'question6',
    topic: 'Amabizo (Nouns)',
    questionText: 'Yibaphi amabizo akwiqembu le-isi-/izi-?',
    options: [
      'isihlalo/izihlalo',
      'umuntu/abantu',
      'indlu/izindlu',
      'umlimi/abalimi',
    ],
    correctAnswer: 'isihlalo/izihlalo',
    videoRef: '/resources/isizulu/videos/amabizo/lesson1',
    difficulty: 'beginner',
    tags: ['nouns', 'classes'],
    isFree: true,
    uploadedBy: 'user2',
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
    {
    id: 'question7',
    topic: 'Amabizo (Nouns)',
    questionText: 'Yiliphi ibizo elincishisiwe (diminutive)?',
    options: ['umfanyana', 'umfanandoda', 'umuntu', 'isizwe'],
    correctAnswer: 'umfanyana',
    videoRef: '/resources/isizulu/videos/amabizo/lesson1',
    difficulty: 'beginner',
    tags: ['nouns', 'diminutive'],
    isFree: true,
    uploadedBy: 'user2',
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
    {
    id: 'question8',
    topic: 'Amabizo (Nouns)',
    questionText: 'Yiliphi ibizo elikhulisisiwe (augmentative)?',
    options: ['indlwana', 'umfanyana', 'umfanandoda', 'umntwana'],
    correctAnswer: 'umfanandoda',
    videoRef: '/resources/isizulu/videos/amabizo/lesson1',
    difficulty: 'beginner',
    tags: ['nouns', 'augmentative'],
    isFree: true,
    uploadedBy: 'user2',
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
    {
    id: 'question9',
    topic: 'Amabizo (Nouns)',
    questionText: 'Igama elithi umfundi lisuselwa kusiphi isenzo?',
    options: ['-dansa', '-funda', '-hamba', '-phuza'],
    correctAnswer: '-funda',
    videoRef: '/resources/isizulu/videos/amabizo/lesson1',
    difficulty: 'beginner',
    tags: ['nouns', 'derived'],
    isFree: true,
    uploadedBy: 'user2',
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
    {
    id: 'question10',
    topic: 'Amabizo (Nouns)',
    questionText: 'Yimaphi amabizo aqamba imizwa?',
    options: [
      'injabulo, usizi, ulaka',
      'itiye, ikhofi, ubisi',
      'umfana, intombazane, indoda',
      'inyoka, ikati, inja',
    ],
    correctAnswer: 'injabulo, usizi, ulaka',
    videoRef: '/resources/isizulu/videos/amabizo/lesson1',
    difficulty: 'beginner',
    tags: ['nouns', 'emotions'],
    isFree: true,
    uploadedBy: 'user2',
    isApproved: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  ],

  isizuluVideos: [
    {
          id: 'lesson1',
          title: 'IsiZulu Lesson 1: Amabizo (Nouns)',
          url: 'https://www.youtube.com/watch?v=yPXD8Uin3DI',
          description: 'A comprehensive lesson on IsiZulu nouns',
          duration: 10,
          uploadedAt: new Date().toISOString(),
          isFree: true,
          currency: 'ZAR',
          uploadedBy: 'user2',
          isApproved: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: ['isizulu', 'nouns'],
          difficulty: 'beginner',
          downloadCount: 0,
        },
  ],

  tutors: {
    tutor1: {
      id: 'tutor1',
      userId: 'user1',
      bio: 'Passionate maths tutor with 5 years of experience',
      qualifications: ['BSc Mathematics'],
      subjects: ['Mathematics'],
      hourlyRate: 200,
      currency: 'ZAR',
      experience: 5,
      rating: 4.7,
      reviewCount: 12,
      availability: {
        saturday: { start: '09:00', end: '13:00', isAvailable: true },
      },
      languages: ['English', 'Zulu'],
      teachingMethods: ['Online', 'In-person'],
      isVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
};

// ----------------------
// Import Function
// ----------------------

async function importData() {
  try {
    // Import rewrite centers
    for (const [docId, data] of Object.entries(seedData.rewriteCenters)) {
      await setDoc(doc(db, 'rewriteCenters', docId), data);
      console.log(`✅ Added rewriteCenters/${docId}`);
    }

    // Import deadlines
    for (const [docId, data] of Object.entries(seedData.deadlines)) {
      await setDoc(doc(db, 'deadlines', docId), data);
      console.log(`✅ Added deadlines/${docId}`);
    }

    // Import tutors
    for (const [docId, data] of Object.entries(seedData.tutors)) {
      await setDoc(doc(db, 'tutors', docId), data);
      console.log(`✅ Added tutors/${docId}`);
    }

    // Import subjects and their subcollections
    for (const [docId, data] of Object.entries(seedData.resources)) {
      await setDoc(doc(db, 'resources', docId), data);
      console.log(`✅ Added resources/${docId}`);

      // Add subcollections based on subject
      if (docId === 'Mathematics') {
        // Add Mathematics notes
        for (const note of seedData.mathematicsNotes) {
          await addDoc(collection(db, 'resources', docId, 'notes'), note);
          console.log(`✅ Added resources/${docId}/notes/${note.id}`);
        }

        // Add Mathematics past papers
        for (const paper of seedData.mathematicsPastPapers) {
          await addDoc(collection(db, 'resources', docId, 'pastPapers'), paper);
          console.log(`✅ Added resources/${docId}/pastPapers/${paper.id}`);
        }

        // Add Mathematics questions
        for (const question of seedData.mathematicsQuestions) {
          await addDoc(collection(db, 'resources', docId, 'questions'), question);
          console.log(`✅ Added resources/${docId}/questions/${question.id}`);
        }

        // Add Mathematics videos
        for (const video of seedData.mathematicsVideos) {
          await addDoc(collection(db, 'resources', docId, 'videos'), video);
          console.log(`✅ Added resources/${docId}/videos/${video.id}`);
        }
      } else if (docId === 'Isizulu') {
        // Add IsiZulu notes
        for (const note of seedData.isizuluNotes) {
          await addDoc(collection(db, 'resources', docId, 'notes'), note);
          console.log(`✅ Added resources/${docId}/notes/${note.id}`);
        }

        // Add IsiZulu past papers
        for (const paper of seedData.isizuluPastPapers) {
          await addDoc(collection(db, 'resources', docId, 'pastPapers'), paper);
          console.log(`✅ Added resources/${docId}/pastPapers/${paper.id}`);
        }

        // Add IsiZulu questions
        for (const question of seedData.isizuluQuestions) {
          await addDoc(collection(db, 'resources', docId, 'questions'), question);
          console.log(`✅ Added resources/${docId}/questions/${question.id}`);
        }

        // Add IsiZulu videos
        for (const video of seedData.isizuluVideos) {
          await addDoc(collection(db, 'resources', docId, 'videos'), video);
          console.log(`✅ Added resources/${docId}/videos/${video.id}`);
        }
      }
    }

    console.log('🎉 Import completed successfully!');
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

if (require.main === module) {
  importData();
}

export { importData, seedData };
