(set-logic ALL_SUPPORTED) 

(synth-fun loudnessPatternGen ((i Int)) Int
  ((I Int)) 
(  (I Int (i 0 1 2 3 4 5 6 
   (+ I I) (- I I) (* I I) (mod I I)
   ))
))
(synth-fun durationPatternGen ((i Int)) Int
  ((I Int)) 
(  (I Int (i 0 1 2 3 4 5 6 
   (+ I I) (- I I) (* I I) (mod I I)
   ))
))
(declare-var i Int)
; index, duration -> volume
; index - > volume
(constraint (= (loudnessPatternGen 1 ) 1)) 
(constraint (= (loudnessPatternGen 2 ) 2)) 
(constraint (= (loudnessPatternGen 3 ) 3)) 
(constraint (= (loudnessPatternGen 4 ) 4))
(constraint (= (loudnessPatternGen 5 ) 5))
(constraint (= (loudnessPatternGen 6 ) 6))
(constraint (= (loudnessPatternGen 7 ) 7))
(constraint (= (loudnessPatternGen 8 ) 8))
(constraint (= (loudnessPatternGen 9 ) 9))
(constraint (= (loudnessPatternGen 10 ) 10))
; index -> duration
(constraint (= (durationPatternGen 1 ) 1)) ; map the sound output to the same drum index 
(constraint (= (durationPatternGen 2 ) 2)) 
(constraint (= (durationPatternGen 3 ) 3)) 
(constraint (= (durationPatternGen 4 ) 4))
(constraint (= (loudnessPatternGen 5 ) 5))
(constraint (= (loudnessPatternGen 6 ) 6))
(constraint (= (loudnessPatternGen 7 ) 7))
(constraint (= (loudnessPatternGen 8 ) 8))
(constraint (= (loudnessPatternGen 9 ) 9))
(constraint (= (loudnessPatternGen 10 ) 10))



(check-synth)
