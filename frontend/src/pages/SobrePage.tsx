import { Link } from 'react-router-dom'

export function SobrePage() {
    return (
        <main className="pagina-sobre">
            <article className="sobre-painel">
                <Link className="link-voltar" to="/">
                    ← Voltar ao início
                </Link>

                <div className="sobre-texto">
                    <h1>Sobre este caderno</h1>

                    <p>
                        Desde a infância, guardo na memória a imagem da minha mãe
                        com seu caderninho de receitas já surrado pelo tempo. Foi
                        com ele que ela preparou muitos dos sabores que marcaram
                        minha história: bolinhos de chuva nas tardes chuvosas,
                        bolo de cenoura com bastante cobertura de chocolate,
                        bolinhos de fubá com leite condensado, pães de Cristo e
                        tantas outras receitas feitas com carinho.
                        Ao observá-la na cozinha, comecei a me interessar pela
                        culinária e pela confeitaria. Foi assim que aprendi muitas
                        coisas e, com o tempo, também passei a ter meu próprio
                        caderninho, preenchido com receitas copiadas do caderno dela.
                    </p>

                    <p>
                        Essas lembranças ocupam um lugar muito especial na minha
                        memória. Elas representam momentos de paz e tranquilidade
                        na infância, quando a família se reunia em volta da mesa
                        para comer um bolo, partir o pão e simplesmente estar junta.
                        Com o passar dos anos, comecei a assumir o papel de preparar
                        os bolos e as receitas da família — e, cá entre nós, minha
                        mãe adora que eu tenha assumido essa função. Para mim, porém,
                        isso é uma honra. É uma forma de continuar fazendo aquilo
                        que um dia ela fez com tanto carinho por mim, pelo meu irmão
                        e por toda a família.
                    </p>

                    <p>
                        Este Caderno Digital de Receitas é, acima de tudo, uma
                        homenagem em vida à mulher que sempre fez o possível para
                        não desamparar seus filhos; que continuou se esforçando,
                        mesmo quando já não tinha forças, para cumprir com amor o
                        seu papel de mãe.
                        Como nem sempre podemos estar com o caderno físico em mãos,
                        este projeto nasceu também como uma forma prática de manter
                        sempre por perto aquele caderninho de receitas com o Ursinho
                        Pooh na capa.
                        Talvez tudo isso pareça simples ou comum para ela. Mas marcou
                        profundamente, de maneira positiva, a trajetória e a história
                        da pequena Andry.
                    </p>
                    <p>
                        Por: Andrielly Patrícia.
                    </p>
                </div>

                <figure className="sobre-ilustracao">
                    <img
                        src="/images/ursinho_pooh.png"
                        alt="Ilustração do Ursinho Pooh"
                    />
                </figure>
            </article>
        </main>
    )
}