(set-logic ALL_SUPPORTED) 


( declare-datatypes ( ( Pair 0) ) (
(( pair ( first Int ) ( second Int )) )))

(synth-fun patternGen ((i Int)) Pair
  ((P Pair) (I Int))
  ((P Pair ( ;what yields a pair ,pass in non-terminals
    (pair I I)
  ))
  (I Int (i 0 1 2 3 4 5 6
  (+ I I) (- I I) (* I I) (mod I I)
  ))
))
(declare-var i Int)
(declare-var j Int)
;(index) -> (loudness, duration)
(constraint (= (patternGen 1) (pair 3 5)));
(constraint (= (patternGen 2) (pair 5 10))); 
(constraint (= (patternGen 3) (pair 7 15)));
(constraint (= (patternGen 4) (pair 9 20)));
(constraint (= (patternGen 5) (pair 11 25)));
(constraint (= (patternGen 6) (pair 13 30)));
(constraint (= (patternGen 7) (pair 15 35)));
(constraint (= (patternGen 8) (pair 17 40)));
(constraint (= (patternGen 9) (pair 19 45)));
(constraint (= (patternGen 10) (pair 21 50)));


(check-synth)
