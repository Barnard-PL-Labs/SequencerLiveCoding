#lang rosette

(require rosette/lib/synthax)
 

(define m1 (list* 1 2 3 4 5))

(define (melody)
  (??))

(define binding
    (synthesize #:forall (m1)
                #:guarantee (assert (= (melody) (m1)) )))

(print-forms binding)


