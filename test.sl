(set-logic NIA)
(synth-fun patternGen ((i Int)) Int
  ((I Int) (B Bool))
(  (I Int (i 0 1 2 3 4 5 6
    (+ I I) (- I I) (* I I) (mod I I)
  ))
  (B Bool (
    (<= I I) (< I I) (>= I I) (> I I)
  ))
)
)
(declare-var i Int)
(constraint (= (patternGen 0) 1))
(constraint (= (patternGen 1) 1))
(constraint (= (patternGen 2) 1))
(check-synth)
