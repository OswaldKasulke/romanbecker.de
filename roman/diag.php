<?php echo json_encode(array_values(array_diff(scandir('.'), ['.','..']))); ?>
