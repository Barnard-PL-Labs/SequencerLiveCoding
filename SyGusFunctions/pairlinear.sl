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
(constraint (= (patternGen 1) (pair 2 1)));
(constraint (= (patternGen 2) (pair 0 2))); 
(constraint (= (patternGen 3) (pair 2 0)));
(constraint (= (patternGen 4) (pair 0 1)));
(constraint (= (patternGen 5) (pair 2 2)));
(constraint (= (patternGen 6) (pair 0 0)));
(constraint (= (patternGen 7) (pair 2 1)));
(constraint (= (patternGen 8) (pair 0 2)));
(constraint (= (patternGen 9) (pair 2 0)));
(constraint (= (patternGen 10) (pair 0 1)));


(check-synth)
