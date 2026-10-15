<?php
/**
 * Tamni način — gumb u zaglavlju (.hikeit-nacin).
 *
 * Prepisuje `--wp--preset--color--*` na <html data-mode="dark">, pa sve što
 * koristi paletu iz theme.json prati (isti pristup kao pd-pinklec). Odabir pamti
 * localStorage; bez njega se slijedi postavka sustava.
 * Boje u istom redoslijedu kao paleta u theme.json.
 */

add_action( 'wp_head', function () {
	$tamno = array(
		'base'       => '#121011',
		'base-2'     => '#2C2827',
		'contrast'   => '#EFEBEA',
		'contrast-2' => '#A09897',
		'accent'     => '#F05648',
		'accent-2'   => '#FF7A6E',
		'surface'    => '#1A1718',
	);
	$css = 'html[data-mode="dark"]{color-scheme:dark;';
	foreach ( $tamno as $slug => $boja ) {
		$css .= "--wp--preset--color--$slug:$boja;";
	}
	?>
<style><?php echo $css . '}'; // phpcs:ignore WordPress.Security.EscapeOutput ?></style>
<script>try{var d=document.documentElement.dataset,m=localStorage.getItem('hikeit-nacin');d.mode=m||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){}</script>
	<?php
} );

add_action( 'wp_footer', function () {
	?>
<script>
document.querySelectorAll('.hikeit-nacin').forEach(function(b){
	var d=document.documentElement.dataset;
	function pokazi(){b.setAttribute('aria-pressed',d.mode==='dark')}
	b.addEventListener('click',function(){
		d.mode=d.mode==='dark'?'light':'dark';
		try{localStorage.setItem('hikeit-nacin',d.mode)}catch(e){}
		pokazi();
	});
	pokazi();
});
</script>
	<?php
} );
