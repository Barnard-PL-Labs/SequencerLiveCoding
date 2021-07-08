(set-logic ALL_SUPPORTED) 


( declare-datatypes ( ( Pair 0) ) (
(( pair ( first Int ) ( second Int )) )))

(synth-fun patternGen ((i i Pair)) Int
  ((I Int) (P Pair)) 
(  (I Int (i 0 1 2 3 4 5 6
  ))
  (P Pair ( ;what yields a pair ,pass in non-terminals
    (pair I I)
  ))
))
(declare-var i Int)
(constraint (= (patternGen pair 1 1) (15))) ;a input can't produce 2 outputs, can we try an output with 2 inputs?
; (constraint (= (patternGen 0) (pair 0 0)))
(check-synth)
