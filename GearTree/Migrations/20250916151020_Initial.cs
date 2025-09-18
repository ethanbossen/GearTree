using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GearTree.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Amplifiers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    PhotoUrl = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Summary = table.Column<string>(type: "TEXT", nullable: false),
                    IsTube = table.Column<bool>(type: "INTEGER", nullable: false),
                    GainStructure = table.Column<string>(type: "TEXT", nullable: false),
                    YearStart = table.Column<int>(type: "INTEGER", nullable: false),
                    YearEnd = table.Column<int>(type: "INTEGER", nullable: true),
                    PriceStart = table.Column<int>(type: "INTEGER", nullable: false),
                    PriceEnd = table.Column<int>(type: "INTEGER", nullable: false),
                    Wattage = table.Column<int>(type: "INTEGER", nullable: false),
                    SpeakerConfiguration = table.Column<string>(type: "TEXT", nullable: false),
                    Manufacturer = table.Column<string>(type: "TEXT", nullable: false),
                    OtherPhotos = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Amplifiers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Artists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    PhotoUrl = table.Column<string>(type: "TEXT", nullable: false),
                    HeroPhotoUrl = table.Column<string>(type: "TEXT", nullable: false),
                    OtherPhotos = table.Column<string>(type: "TEXT", nullable: false),
                    Tagline = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Summary = table.Column<string>(type: "TEXT", nullable: false),
                    Bands = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Artists", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Guitars",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    PhotoUrl = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Summary = table.Column<string>(type: "TEXT", nullable: false),
                    Type = table.Column<string>(type: "TEXT", nullable: false),
                    Genres = table.Column<string>(type: "TEXT", nullable: false),
                    Pickups = table.Column<string>(type: "TEXT", nullable: false),
                    YearStart = table.Column<int>(type: "INTEGER", nullable: false),
                    YearEnd = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Guitars", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AmplifierRelation",
                columns: table => new
                {
                    AmplifierId = table.Column<int>(type: "INTEGER", nullable: false),
                    RelatedAmplifierId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AmplifierRelation", x => new { x.AmplifierId, x.RelatedAmplifierId });
                    table.ForeignKey(
                        name: "FK_AmplifierRelation_Amplifiers_AmplifierId",
                        column: x => x.AmplifierId,
                        principalTable: "Amplifiers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AmplifierRelation_Amplifiers_RelatedAmplifierId",
                        column: x => x.RelatedAmplifierId,
                        principalTable: "Amplifiers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AmplifierArtist",
                columns: table => new
                {
                    AmplifiersId = table.Column<int>(type: "INTEGER", nullable: false),
                    ArtistsId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AmplifierArtist", x => new { x.AmplifiersId, x.ArtistsId });
                    table.ForeignKey(
                        name: "FK_AmplifierArtist_Amplifiers_AmplifiersId",
                        column: x => x.AmplifiersId,
                        principalTable: "Amplifiers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AmplifierArtist_Artists_ArtistsId",
                        column: x => x.ArtistsId,
                        principalTable: "Artists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ArtistGuitar",
                columns: table => new
                {
                    ArtistsId = table.Column<int>(type: "INTEGER", nullable: false),
                    GuitarsId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArtistGuitar", x => new { x.ArtistsId, x.GuitarsId });
                    table.ForeignKey(
                        name: "FK_ArtistGuitar_Artists_ArtistsId",
                        column: x => x.ArtistsId,
                        principalTable: "Artists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ArtistGuitar_Guitars_GuitarsId",
                        column: x => x.GuitarsId,
                        principalTable: "Guitars",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GuitarRelation",
                columns: table => new
                {
                    GuitarId = table.Column<int>(type: "INTEGER", nullable: false),
                    RelatedGuitarId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuitarRelation", x => new { x.GuitarId, x.RelatedGuitarId });
                    table.ForeignKey(
                        name: "FK_GuitarRelation_Guitars_GuitarId",
                        column: x => x.GuitarId,
                        principalTable: "Guitars",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GuitarRelation_Guitars_RelatedGuitarId",
                        column: x => x.RelatedGuitarId,
                        principalTable: "Guitars",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AmplifierArtist_ArtistsId",
                table: "AmplifierArtist",
                column: "ArtistsId");

            migrationBuilder.CreateIndex(
                name: "IX_AmplifierRelation_RelatedAmplifierId",
                table: "AmplifierRelation",
                column: "RelatedAmplifierId");

            migrationBuilder.CreateIndex(
                name: "IX_ArtistGuitar_GuitarsId",
                table: "ArtistGuitar",
                column: "GuitarsId");

            migrationBuilder.CreateIndex(
                name: "IX_GuitarRelation_RelatedGuitarId",
                table: "GuitarRelation",
                column: "RelatedGuitarId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AmplifierArtist");

            migrationBuilder.DropTable(
                name: "AmplifierRelation");

            migrationBuilder.DropTable(
                name: "ArtistGuitar");

            migrationBuilder.DropTable(
                name: "GuitarRelation");

            migrationBuilder.DropTable(
                name: "Amplifiers");

            migrationBuilder.DropTable(
                name: "Artists");

            migrationBuilder.DropTable(
                name: "Guitars");
        }
    }
}
