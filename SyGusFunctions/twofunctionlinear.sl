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
(constraint (= (loudnessPatternGen 1 ) 2)) 
(constraint (= (loudnessPatternGen 2 ) 0)) 
(constraint (= (loudnessPatternGen 3 ) 2)) 
(constraint (= (loudnessPatternGen 4 ) 0))
(constraint (= (loudnessPatternGen 5 ) 2))
(constraint (= (loudnessPatternGen 6 ) 0))
(constraint (= (loudnessPatternGen 7 ) 2))
(constraint (= (loudnessPatternGen 8 ) 0))
(constraint (= (loudnessPatternGen 9 ) 2))
(constraint (= (loudnessPatternGen 10 ) 0))
; index -> duration
(constraint (= (durationPatternGen 1 ) 1)) ; map the sound output to the same drum index 
(constraint (= (durationPatternGen 2 ) 2)) 
(constraint (= (durationPatternGen 3 ) 0)) 
(constraint (= (durationPatternGen 4 ) 1))
(constraint (= (durationPatternGen 5 ) 2))
(constraint (= (durationPatternGen 6 ) 0))
(constraint (= (durationPatternGen 7 ) 1))
(constraint (= (durationPatternGen 8 ) 2))
(constraint (= (durationPatternGen 9 ) 0))
(constraint (= (durationPatternGen 10 ) 1))

(check-synth)
