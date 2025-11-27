import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpar dados existentes (opcional - comente se não quiser limpar)
  await prisma.product.deleteMany({});
  await prisma.supplier.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("✅ Dados antigos removidos");

  // Hash da senha padrão
  const senhaHash = await bcrypt.hash("senha123", 10);

  // Criar usuário admin
  const admin = await prisma.user.create({
    data: {
      nome: "Administrador Sistema",
      email: "admin@fatec.sp.gov.br",
      senha: senhaHash,
      cargo: "admin",
    },
  });
  console.log("✅ Admin criado:", admin.email);

  // Criar usuários normais
  const users = await Promise.all([
    prisma.user.create({
      data: {
        nome: "João Silva",
        email: "joao.silva@empresa.com",
        senha: senhaHash,
        cargo: "user",
      },
    }),
    prisma.user.create({
      data: {
        nome: "Maria Santos",
        email: "maria.santos@empresa.com",
        senha: senhaHash,
        cargo: "user",
      },
    }),
    prisma.user.create({
      data: {
        nome: "Pedro Oliveira",
        email: "pedro.oliveira@empresa.com",
        senha: senhaHash,
        cargo: "user",
      },
    }),
  ]);
  console.log("✅ 3 usuários normais criados");

  // Criar fornecedores
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        nome: "Tech Solutions Ltda",
        cnpj: "12.345.678/0001-90",
        cep: "01310-100",
        rua: "Avenida Paulista",
        cidade: "São Paulo",
        estado: "SP",
        numero: "1000",
        email: "contato@techsolutions.com.br",
        telefone: "(11) 3456-7890",
      },
    }),
    prisma.supplier.create({
      data: {
        nome: "Office Supplies Co.",
        cnpj: "23.456.789/0001-01",
        cep: "04543-011",
        rua: "Avenida Brigadeiro Faria Lima",
        cidade: "São Paulo",
        estado: "SP",
        numero: "3477",
        email: "vendas@officesupplies.com.br",
        telefone: "(11) 2345-6789",
      },
    }),
    prisma.supplier.create({
      data: {
        nome: "Industrial Parts Brasil",
        cnpj: "34.567.890/0001-12",
        cep: "13040-900",
        rua: "Avenida Norte Sul",
        cidade: "Campinas",
        estado: "SP",
        numero: "500",
        email: "atendimento@industrialparts.com.br",
        telefone: "(19) 3234-5678",
      },
    }),
    prisma.supplier.create({
      data: {
        nome: "Equipamentos e Ferramentas Silva",
        cnpj: "45.678.901/0001-23",
        cep: "13100-000",
        rua: "Rua das Indústrias",
        cidade: "São José dos Campos",
        estado: "SP",
        numero: "250",
        email: "comercial@efsilva.com.br",
        telefone: "(12) 3456-7890",
      },
    }),
    prisma.supplier.create({
      data: {
        nome: "MatPrime Materiais",
        cnpj: "56.789.012/0001-34",
        cep: "09750-000",
        rua: "Avenida Industrial",
        cidade: "São Bernardo do Campo",
        estado: "SP",
        numero: "789",
        email: "vendas@matprime.com.br",
        telefone: "(11) 4567-8901",
      },
    }),
  ]);
  console.log("✅ 5 fornecedores criados");

  // Criar produtos/pedidos
  const statusOptions = [
    "Pendente",
    "Aprovado",
    "Negado",
    "Realizado",
    "Entregue",
    "Finalizado",
  ];
  const categorias = [
    "Eletrônicos",
    "Material de Escritório",
    "Equipamentos",
    "Ferramentas",
    "Materiais de Construção",
  ];
  const tipos = [
    "Equipamento",
    "Consumível",
    "Ferramenta",
    "Mobiliário",
    "Tecnologia",
  ];

  const products = [];

  // Produtos do usuário João Silva
  products.push(
    await prisma.product.create({
      data: {
        nome: "Notebook Dell Inspiron 15",
        tipo: "Tecnologia",
        quantidade: 2,
        categoria: "Eletrônicos",
        descricao: "Notebook para desenvolvimento de software",
        status: "Finalizado",
        userId: users[0].id,
        supplierId: suppliers[0].id,
        cod_id: "NB-001",
        grupo: "Informática",
        classe: "Hardware",
        material: "Eletrônico",
      },
    }),
    await prisma.product.create({
      data: {
        nome: "Mouse Logitech MX Master 3",
        tipo: "Equipamento",
        quantidade: 5,
        categoria: "Eletrônicos",
        descricao: "Mouse ergonômico para uso profissional",
        status: "Entregue",
        userId: users[0].id,
        supplierId: suppliers[0].id,
        cod_id: "MS-002",
        grupo: "Periféricos",
        classe: "Acessórios",
      },
    }),
    await prisma.product.create({
      data: {
        nome: "Teclado Mecânico",
        tipo: "Equipamento",
        quantidade: 3,
        categoria: "Eletrônicos",
        descricao: "Teclado mecânico RGB para programadores",
        status: "Realizado",
        userId: users[0].id,
        supplierId: suppliers[0].id,
      },
    }),
    await prisma.product.create({
      data: {
        nome: "Monitor LG 27 4K",
        tipo: "Equipamento",
        quantidade: 4,
        categoria: "Eletrônicos",
        descricao: "Monitor 4K para edição de imagens",
        status: "Aprovado",
        userId: users[0].id,
      },
    })
  );

  // Produtos da usuária Maria Santos
  products.push(
    await prisma.product.create({
      data: {
        nome: "Resma de Papel A4",
        tipo: "Consumível",
        quantidade: 50,
        categoria: "Material de Escritório",
        descricao: "Papel sulfite A4 75g/m²",
        status: "Finalizado",
        userId: users[1].id,
        supplierId: suppliers[1].id,
        cod_id: "PAP-001",
        grupo: "Papelaria",
        classe: "Consumível",
      },
    }),
    await prisma.product.create({
      data: {
        nome: "Canetas Esferográficas",
        tipo: "Consumível",
        quantidade: 100,
        categoria: "Material de Escritório",
        descricao: "Canetas azuis e pretas",
        status: "Entregue",
        userId: users[1].id,
        supplierId: suppliers[1].id,
      },
    }),
    await prisma.product.create({
      data: {
        nome: "Cadeiras de Escritório",
        tipo: "Mobiliário",
        quantidade: 10,
        categoria: "Equipamentos",
        descricao: "Cadeiras ergonômicas com apoio lombar",
        status: "Realizado",
        userId: users[1].id,
        supplierId: suppliers[1].id,
      },
    }),
    await prisma.product.create({
      data: {
        nome: "Arquivos de Aço",
        tipo: "Mobiliário",
        quantidade: 5,
        categoria: "Material de Escritório",
        descricao: "Arquivos de aço 4 gavetas",
        status: "Aprovado",
        userId: users[1].id,
      },
    }),
    await prisma.product.create({
      data: {
        nome: "Grampeadores e Perfuradores",
        tipo: "Equipamento",
        quantidade: 15,
        categoria: "Material de Escritório",
        descricao: "Kit completo para escritório",
        status: "Pendente",
        userId: users[1].id,
      },
    })
  );

  // Produtos do usuário Pedro Oliveira
  products.push(
    await prisma.product.create({
      data: {
        nome: "Furadeira de Impacto",
        tipo: "Ferramenta",
        quantidade: 3,
        categoria: "Ferramentas",
        descricao: "Furadeira elétrica 650W com maleta",
        status: "Finalizado",
        userId: users[2].id,
        supplierId: suppliers[3].id,
        cod_id: "FER-001",
        grupo: "Ferramentas Elétricas",
        classe: "Perfuração",
      },
    }),
    await prisma.product.create({
      data: {
        nome: "Jogo de Chaves Allen",
        tipo: "Ferramenta",
        quantidade: 10,
        categoria: "Ferramentas",
        descricao: "Conjunto completo de chaves allen métricas",
        status: "Entregue",
        userId: users[2].id,
        supplierId: suppliers[3].id,
      },
    }),
    await prisma.product.create({
      data: {
        nome: "Serra Circular",
        tipo: "Ferramenta",
        quantidade: 2,
        categoria: "Ferramentas",
        descricao: "Serra circular 1400W para cortes precisos",
        status: "Realizado",
        userId: users[2].id,
        supplierId: suppliers[3].id,
      },
    }),
    await prisma.product.create({
      data: {
        nome: "Cimento Portland",
        tipo: "Consumível",
        quantidade: 100,
        categoria: "Materiais de Construção",
        descricao: "Sacos de cimento 50kg",
        status: "Aprovado",
        userId: users[2].id,
      },
    }),
    await prisma.product.create({
      data: {
        nome: "Tijolos Cerâmicos",
        tipo: "Consumível",
        quantidade: 5000,
        categoria: "Materiais de Construção",
        descricao: "Tijolos de 6 furos",
        status: "Pendente",
        userId: users[2].id,
      },
    }),
    await prisma.product.create({
      data: {
        nome: "Parafusadeira Elétrica",
        tipo: "Ferramenta",
        quantidade: 4,
        categoria: "Ferramentas",
        descricao: "Parafusadeira/furadeira sem fio 12V",
        status: "Negado",
        justificativa: "Orçamento insuficiente neste período",
        userId: users[2].id,
      },
    }),
    await prisma.product.create({
      data: {
        nome: "Multímetro Digital",
        tipo: "Equipamento",
        quantidade: 6,
        categoria: "Ferramentas",
        descricao: "Multímetro digital profissional",
        status: "Pendente",
        userId: users[2].id,
      },
    })
  );

  console.log("✅ 16 produtos/pedidos criados");

  console.log("\n🎉 Seed concluído com sucesso!");
  console.log("\n📊 Resumo:");
  console.log(`- 1 Admin: ${admin.email}`);
  console.log(`- 3 Usuários normais`);
  console.log(`- 5 Fornecedores`);
  console.log(`- 16 Produtos/Pedidos`);
  console.log("\n🔑 Credenciais de acesso:");
  console.log("Senha padrão para todos: senha123");
  console.log(`\nAdmin: ${admin.email}`);
  users.forEach((user) => console.log(`User: ${user.email}`));
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
